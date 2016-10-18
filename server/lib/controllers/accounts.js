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

const USER_PROPS = ['_id', 'company', 'fullName'];

const populate = [
    {path: 'borrower', select: 'company'},
    {path: 'lenders.lender', select: 'company'},
];

module.exports = deps => {
    const LoanAccount = mongoose.models.LoanAccount;
    const Proposal = mongoose.models.Proposal;

    return {
        getAccount(req, res, next) {
            LoanAccount.findById(req.params.id).populate(populate).exec()
                .then(
                    doc => {
                        const {role, _id} = req.user;
                        if(role == constants.roles.BORROWER) {
                            if(doc.borrowser._id !== _id) throw new Error('No access');
                        } else if(role == constants.roles.LENDER) {
                            const lender = _.find(doc.lenders, l => l.lender._id == _id);
                            if(!lender) throw new Error('No access');
                            doc.lenders = [lender];
                        }
                        res.send(doc);
                    },
                    next
                )
        },

        getAccounts(req, res, next) {
            const query = {};
            const {role, _id} = req.user;

            if(role == constants.roles.BORROWER) {
                query['borrower._id'] = _id;
            } else if( role == constants.roles.LENDER) {
                query['lenders.lender._id'] = _id;
            }

            const q = req.query;

            if(q['lenders.disbursementDate']) {
                q['lenders.disbursementDate'] = moment.utc(q['lenders.disbursementDate']).toDate()
            }
            if(q['lenders.repaymentDate']) {
                q['lenders.repaymentDate'] = moment.utc(q['lenders.repaymentDate']).toDate()
            }

            const page = q.page || 1;
            delete q.page;
            const limit = 10;
            const skip = (page -1) * limit;

            const agg2 = [
                {$unwind: '$lenders'},
                {
                    $lookup: {
                        from: 'users',
                        localField: 'lenders.lender',
                        foreignField: '_id',
                        as: 'lenderObj'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'borrower',
                        foreignField: '_id',
                        as: 'borrower'
                    }
                },
                {
                    $lookup: {
                        from: 'applications',
                        localField: 'application',
                        foreignField: '_id',
                        as: 'application'
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        lender: {
                            _id: '$lenders._id',
                            loanAmount: '$lenders.loanAmount',
                            tenor: '$lenders.tenor',
                            interestRate: '$lenders.interestRate',
                            disbursementDate: '$lenders.disbursementDate',
                            repaymentDate: '$lenders.repaymentDate',
                            lender: {$arrayElemAt: ['$lenderObj', 0]}
                        },
                        application: {$arrayElemAt: ['$application', 0]},
                        borrower: {$arrayElemAt: ['$borrower', 0]},
                        loanAmount: '$loanAmount',
                        createdAt: '$createdAt'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        lenders: {$push: '$lender'},
                        application: {$first: '$application'},
                        borrower: {$first: '$borrower'},
                        loanAmount: {$first: '$loanAmount'},
                        createdAt: {$first: '$createdAt'}
                    }
                },
                {
                    $match: _.extend(q, query)
                },
                {$sort: {createdAt: -1}},
                {$skip: skip},
                {$group: {_id: null, count: {$sum: 1}, docs: {$push: '$$ROOT'}}}
            ];


            LoanAccount.aggregate(agg2)
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
                                if(role == constants.roles.LENDER) {
                                    const lender = _.find(i.lenders, l => l.lender._id == _id);
                                    i.lenders = [lender];
                                } else {
                                    i.lenders = _.map(i.lenders, l => {
                                        l.lender = _.pick(l.lender, USER_PROPS);
                                        return l;
                                    });
                                }
                                i.borrower = _.pick(i.borrower, USER_PROPS);
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
            const loanId = req.body.loanId;

            LoanAccount.findById(req.params.id).populate(populate).exec()
                .then(
                    doc => {
                        const loan = doc.lenders.id(loanId);
                        const payDate = moment(disDate).add(loan.tenor, 'days').toDate();
                        loan.disbursementDate = disDate;
                        loan.repaymentDate = payDate;
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