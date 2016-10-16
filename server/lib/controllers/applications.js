/**
 * Created by amita on 10/9/2016.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var multer = require('multer');
var shortid = require('shortid');
var _ = require('lodash');
var ObjId = mongoose.Types.ObjectId;
var templates = require('../../../templates');
var path = require('path');
var uuid = require('uuid');
var mkdirp = require('mkdirp');
var constants = require('../../../constants');

const USER_PROPS =  'company email';
const populate = [
    {path: 'company', select: USER_PROPS},
    {path: 'lenders', select: USER_PROPS},
    {path: 'buyer', select: USER_PROPS}
];

module.exports = deps => {
    const User = mongoose.models.User;
    const Application = mongoose.models.Application;
    const Proposal = mongoose.models.Proposal;
    const LoanAccount = mongoose.models.LoanAccount;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const dir =  path.join(deps.config.uploadDir, req.user._id, req.instance.id);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, uuid() + path.extname(file.originalname));
        }
    });
    var uploader = multer({ storage: storage });

    function scopeQuery(req) {
        const id = req.params.id;
        const query = {};
        if(id) {
            query._id = id;
        }
        const userRole = req.user.role;
        const userId = req.user._id;
        if(userRole == constants.roles.BORROWER) {
            query.company = userId;
        } else if(userRole == constants.roles.BUYER) {
            query.buyerEmail = req.user.email;
        } else if(userRole == constants.roles.LENDER) {
            query.lenders = {$in: [userId]};
        }
    }

    return {

        getApplications(req, res, next) {
            const id = req.params.id;
            const query = {};
            const userRole = req.user.role;
            const userId = req.user._id;
            if(userRole == constants.roles.BORROWER) {
                query['company._id'] = userId;
            } else if(userRole == constants.roles.BUYER) {
                query.buyerEmail = req.user.email;
                //query.receivableStatus = 'pending';
                //query.status = constants.status.UNDER_REVIEW;
            } else if(userRole == constants.roles.LENDER) {
                query.lenders = {$in: [userId]};
                query.status = constants.status.APPROVED;
                //query.account
            }

            if(id) {
                const query = {
                    _id: id
                };
                if(userRole == constants.roles.BORROWER) {
                    query.company = userId;
                } else if(userRole == constants.roles.BUYER) {
                    query.buyerEmail = req.user.email;
                } else if(userRole == constants.roles.LENDER) {
                    query.lenders = {$in: [userId]};
                }

                const agg = [
                    {
                        $match: query
                    }
                ];
                if(userRole == constants.roles.ADMIN) {
                    agg.push({$lookup: {
                        from: 'proposals',
                        localField: '_id',
                        foreignField: 'application',
                        as: 'proposals'
                    }})
                }
                Application.aggregate(agg).then(
                    doc => {
                        const _populate = _.clone(populate);
                        if(userRole == constants.roles.ADMIN) {
                            _populate.push({path: 'proposals.lender', model: 'User', select: USER_PROPS})
                        }
                        return Application.populate(doc, _populate);
                    }
                ).then(
                    docs => {
                        const doc = docs[0];
                        if(!doc) return res.status(404).end();

                        if(userRole == constants.roles.BUYER) {
                            doc.documents = _.filter(doc.documents, {fieldname: 'receivable'});
                        }
                        res.send(doc);
                    },
                    next
                )
            } else {
                const q = req.query;
                const page = q.page || 1;
                delete q.page;
                const limit = 10;
                const skip = (page -1) * limit;

                const agg = [
                    {$lookup: {
                        from: 'users',
                        localField: 'company',
                        foreignField: '_id',
                        as: 'company'
                    }},
                    {
                        $match: _.extend(q, query)
                    },
                    {$sort: {createdAt: -1}},
                    {$skip: skip},
                    {$group: {_id: null, count: {$sum: 1}, docs: {$push: '$$ROOT'}}}
                ];

                Application.aggregate(agg).then(
                    result => {
                        const r = result[0];

                        if(!r) return res.send({
                            total: 0,
                            page: 1,
                            pages: 1,
                            limit: 10,
                            docs: []
                        });

                        const data = {
                            total: r.count,
                            page: page,
                            pages: Math.floor(r.count/limit) || 1,
                            limit: limit,
                            docs: r.docs.map(i => {
                                i.company = _.pick(i.company[0], ['company']);
                                if(userRole == constants.roles.BUYER) {
                                    i.documents = _.filter(i.documents, {fieldname: 'receivable'});
                                }
                                return i;
                            })
                        };
                        res.send(data);
                    },
                    next
                );
            }
        },

        createApplication: [
            (req, res, next) => {
                req.instance = req.instance || {};
                req.instance.id = ObjId().toString();
                next();
            },
            uploader.any(),
            (req, res, next) => {
                const application = {
                    _id: req.instance.id,
                    documents: _.forEach(req.files, file => ({
                        type: file.fieldname, filename: file.filename, size: file.size, destination: file.destination})),

                };
                _.assign(application, JSON.parse(req.body.model), {
                    company: req.user._id,
                    status: constants.status.PENDING
                });

                let buyerExists = false;

                User.findOne({email: application.buyerEmail}).exec().then(
                    user => {
                        if(user) {
                            application.buyer = user._id;
                            buyerExists = true;
                        }
                        return user;
                    }
                ).then(
                    () =>  Application.create(application)
                ).then(
                    doc => {
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: constants.adminEmail,
                            subject: 'Application created',
                            html: templates.applicationReceived(doc)
                        });
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: application.buyerEmail,
                            subject: 'New application: Validate Rec Doc',
                            html: templates.verifyRecDoc(doc)
                        });

                        return doc;
                    }
                ).then(
                    doc => res.send(doc),
                    next
                )
            }
        ],

        updateApplication(req, res, next) {
            const {role} = req.user;
            const data = req.body;
            const q = scopeQuery(req);
            let updateData = {};

            if(role == constants.roles.BUYER) {
                updateData = _.pick(data, 'receivableStatus');
            } else {
                updateData = data;
            }

            Application.findOne(q).exec().then(
                doc => {
                    if(!doc) throw new Error('Not found');

                    return  Application.findByIdAndUpdate(req.params.id, updateData, {new: true}).populate(populate).exec()
                }
            ).then(
                doc => {
                    var mailer = deps.nodemailer;
                    if(updateData.adminComment) {
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: [doc.company.email],
                            subject: 'Additional information requested',
                            html: templates.docRequested(doc)
                        });
                    } else if (updateData.receivableStatus == 'approved') {
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: [constants.adminEmail, doc.company.email],
                            subject: 'Receivable doc status updated',
                            html: templates.recStatusUpdated(doc)
                        });
                    }
                    return doc;
                }
            ).then(
                doc => {
                    if(role == constants.roles.BUYER) {
                        doc.documents = _.filter(doc.documents, {fieldname: 'receivable'});
                    }
                    res.send(doc)
                },
                next
            );
        },

        uploadDocs: [
            (req, res, next) => {
              Application.findOne(scopeQuery(req)).exec().then(
                  doc => {
                      if(!doc) {
                          res.status(404).send('Not found');
                      } else {
                          next();
                      }
                  },
                  next
              )
            },
            (req, res, next) => {
                req.instance = req.instance || {};
                req.instance.id = req.params.id;
                next();
            },
            uploader.any(),
            (req, res, next) => {
                Application.findById(req.params.id).exec()
                    .then(
                        app => {
                            req.files.forEach(doc => {
                                const f = _.find(app.documents, {fieldname: doc.fieldname});
                                if(f) doc.fieldname = f.fieldname + shortid();
                                doc.fieldname = doc.fieldname.replace(/[^\w\s]/gi, '');
                                app.documents.push(doc);
                            });
                            return app.save();
                        }
                    )
                    .then(
                        doc => res.send(doc),
                        next
                    )
            }
        ],

        assignToLenders(req, res, next) {
            const lenders = req.body;
            const id = req.params.id;

            Application.findByIdAndUpdate(id, {
                lenders
            }, {new: true}).populate(populate)
                .exec()
                .then(
                    doc => {
                        const lenders = _.map(doc.lenders, 'email');
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: lenders,
                            subject: 'Application received',
                            html: templates.lenderAssigned(doc)
                        });
                        return doc;
                    }
                )
                .then(
                    doc => res.send(doc),
                    next
                )
        },

        getDoc(req, res, next) {
            const {id, doc} = req.params;
            const {role, _id, email} = req.user;

            if(role == constants.roles.BUYER && doc != 'receivable') {
                return res.status(404).send('Not found');
            }

            const query = {_id: id};
            if(role == constants.roles.BUYER) {
                query.buyerEmail = email;
            } else if(role == constants.roles.LENDER) {
                query.lenders = {$in: [_id]};
            } else if(role == constants.roles.BORROWER) {
                query.company = _id;
            }

            Application.findOne(query).exec().then(
                f => {
                   if(!f) return res.status(404).send('Not found');

                    const file = _.find(f.documents, {fieldname: doc});
                    res.sendFile(file.path);
                },
                next
            )
        },

        submitProposal(req, res, next) {

            const data = req.body;
            data.lender = req.user._id;
            data.application = req.params.id;
            Proposal.create(data).then(
                doc => res.send(doc),
                next
            )
        },

        lenderReject(req, res, next) {
            Application.findByIdAndUpdate(req.params.id, {
                $pull: {
                    lenders: req.user._id
                }
            }).exec().then(
                doc => res.send(doc),
                next
            )
        },

        createLoanAccount(req, res, next) {
            const proposalId = req.params.id;
            let proposal = null;
            let account = null;
            Proposal.findById(proposalId).populate(['application', 'lender']).exec()
                .then(
                    prop => {
                        proposal = prop;
                        return LoanAccount.create({
                            lender: prop.lender._id,
                            loanAmount: prop.loanAmount,
                            interestRate: prop.interestRate,
                            tenor: prop.tenor,
                            application: prop.application._id,
                            borrower: prop.application.company
                        }).then(
                            doc => LoanAccount.populate(doc, 'borrower')
                        );
                    }
                )
                .then(
                    doc => {
                        account = doc;
                        return Application.findByIdAndUpdate(doc.application, {
                            status: constants.status.APPROVED,
                            account: doc._id
                        }, {new: true}).populate(populate).exec();
                    }
                )
                .then(
                    doc => Proposal.findByIdAndUpdate(proposalId, {status: 'accepted'}).exec().then(() => doc)
                )
                .then(
                    app => {
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: [app.company.email, proposal.lender.email],
                            subject: 'Loan account created',
                            html: templates.loanAccountCreated({application: app, account: account, proposal: proposal}),
                            attachments: app.documents.map(i => ({filename: i.fieldname + path.extname(i.filename), path: i.path}))
                        });
                        return app;
                    }
                )
                .then(
                    doc => res.send(doc),
                    next
                );
        },

        updateLoanAccount(req, res, next) {

        },

        getProposal(req, res, next) {
            Proposal.findOne({application: req.params.id, lender: req.user._id}).exec().then(
                doc => res.send(doc),
                next
            )
        }
    }
};