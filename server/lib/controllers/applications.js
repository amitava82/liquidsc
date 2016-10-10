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
];

module.exports = deps => {
    const User = mongoose.models.User;
    const Application = mongoose.models.Application;
    const Proposal = mongoose.models.Proposal;
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
                Application.findById(id).populate(populate).exec().then(
                    docs => res.send(docs),
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
                    doc => res.send(doc),
                    next
                );
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
             $addToSet: { lenders: { $each: lenders } }
            }, {new: true}).populate(populate).exec().then(
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

        },

        createLoanAccount(req, res, next) {

        }
    }
};