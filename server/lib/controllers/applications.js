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

const populate = [
    {path: 'company'},
    {path: 'lenders'},
    {path: 'buyer'},
    {path: 'proposals.lender', model: 'User'}
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

    return {

        getApplications(req, res, next) {
            const id = req.params.id;
            const query = {};
            const userRole = req.user.role;
            const userId = req.user._id;
            if(userRole == constants.roles.BORROWER) {
                query.company = userId;
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
                Application.aggregate([
                    {
                        $match: {_id: id}
                    },
                    {$lookup: {
                        from: 'proposals',
                        localField: '_id',
                        foreignField: 'application',
                        as: 'proposals'
                    }}
                ]).then(
                    doc => Application.populate(doc, populate)
                ).then(
                    doc => res.send(doc[0]),
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
                                i.company = i.company[0];
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
            Application.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate(populate).exec()
                .then(
                    doc => {
                        if(req.body.adminComment) {
                            var mailer = deps.nodemailer;
                            mailer.sendMail({
                                from: 'support@alchcapital.com',
                                to: [doc.company.email],
                                subject: 'Additional information requested',
                                html: templates.docRequested(doc)
                            });
                        }
                        return doc;
                    }
                ).then(
                    doc => res.send(doc),
                    next
                )
        },

        uploadDocs: [
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
            Application.findById(id).exec().then(
                f => {
                    const file = _.find(f.documents, {fieldname: doc});

                    res.sendFile(file.path);
                },
                next
            )
        },

        updateBuyerStatus(req, res, next) {
            const {status, id} = req.params;
            Application.findOneAndUpdate(
                {buyerEmail: req.user.email, _id: id},
                {receivableStatus: status, buyer: req.user._id}, {new: true})
                .populate(populate)
                .exec()
                .then(
                    doc => {
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: [constants.adminEmail, doc.company.email],
                            subject: 'Receivable doc status updated',
                            html: templates.recStatusUpdated(doc)
                        });
                        return doc;
                    }
                )
                .then(
                    doc => res.send(doc),
                    next
                );
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