/**
 * Created by amita on 10/9/2016.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var multer = require('multer');
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
                query.buyer = userId;
                query.receivableStatus = 'pending'
            } else if(userRole == constants.roles.LENDER) {
                query.lenders = {$in: [userId]};
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
                Application.find(_.extend(req.query, query)).populate('company').exec().then(
                    docs => res.send(docs),
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

                User.findOne({email: application.buyerEmail}).exec().then(
                    user => {
                        if(!user) {
                            // TODO
                        } else {
                            application.buyer = user._id;
                        }
                        return user;
                    }
                ).then(
                    () =>  Application.create(application)
                ).then(
                    doc => {
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'noreply@test.com',
                            to: constants.adminEmail,
                            subject: 'Application created',
                            html: templates.applicationReceived(doc)
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

        },

        uploadDocs: [
            uploader.any(),
            (req, res, next) => {

            }
        ],

        assignToLenders(req, res, next) {
            const lenders = req.body;
            const id = req.params.id;

            Application.findByIdAndUpdate(id, {
                $addToSet: {lenders: {$each: lenders}}
            }, {new: true}).populate(populate)
                .exec()
                .then(
                    doc => {
                        const lenders = _.map(doc.lenders, 'email');
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'noreply@test.com',
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
            Application.findOneAndUpdate({buyer: req.user._id, _id: id}, {receivableStatus: status}, {new: true})
                .populate(populate)
                .exec()
                .then(
                    doc => {
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'noreply@test.com',
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
            Proposal.findById(proposalId).populate(['application']).exec()
                .then(
                    prop => {
                        return LoanAccount.create({
                            lender: prop.lender,
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
                    doc => Application.findByIdAndUpdate(doc.application, {status: constants.status.APPROVED}).exec().then(() => doc)
                )
                .then(
                    acc => {
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'noreply@test.com',
                            to: [acc.borrower.email],
                            subject: 'Loan account created',
                            html: templates.loanAccountCreated(acc)
                        });
                        return acc;
                    }
                )
                .then(
                    doc => res.send(doc),
                    next
                );
        },

        updateLoanAccount(req, res, next) {

        }
    }
};