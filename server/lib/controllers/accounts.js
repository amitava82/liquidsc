/**
 * Created by amita on 10/10/2016.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var ObjId = mongoose.Types.ObjectId;
var templates = require('../../../templates');
var constants = require('../../../constants');

module.exports = deps => {
    const LoanAccount = mongoose.models.LoanAccount;
    const Proposal = mongoose.models.Proposal;

    return {

        getAccount(req, res, next) {
            LoanAccount.findById(req.params.id).populate(['borrower', 'lender']).exec()
                .then(
                    docs => res.send(docs),
                    next
                )
        },

        getAccounts(req, res, next) {
            const query = {};
            const {role, _id} = req.user;

            if(role == constants.roles.BORROWER) {
                query['borrower._id'] = _id;
            } else if( role == constants.roles.LENDER) {
                query['lender._id'] = _id;
            }

            const q = req.query;
            const page = q.page || 1;
            delete q.page;
            const limit = 10;
            const skip = (page -1) * limit;

            const agg = [
                {$lookup: {
                    from: 'users',
                    localField: 'borrower',
                    foreignField: '_id',
                    as: 'borrower'
                }},
                {$lookup: {
                    from: 'users',
                    localField: 'lender',
                    foreignField: '_id',
                    as: 'lender'
                }},
                {
                    $match: _.extend(q, query)
                },
                {$skip: skip},
                {$group: {_id: null, count: {$sum: 1}, docs: {$push: '$$ROOT'}}}
            ];

            LoanAccount.aggregate(agg)
                .then(
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
                                i.lender = i.lender[0];
                                i.borrower = i.borrower[0];
                                return i;
                            })
                        };
                        res.send(data);
                    },
                    next
                )
        },

        updateAccount(req, res, next) {
            const disDate = req.body.disbursementDate;

            LoanAccount.findById(req.params.id).populate(['borrower', 'lender']).exec()
                .then(
                    doc => {
                        const payDate = moment(disDate).add(doc.tenor, 'days').toDate();
                        doc.disbursementDate = disDate;
                        doc.repaymentDate = payDate;

                        return doc.save();
                    }
                )
                .then(
                    doc => res.send(doc),
                    next
                )

        }
    }
};