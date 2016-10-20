/**
 * Created by amita on 10/14/2016.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var constants = require('../../../constants');

module.exports = deps => {
    const self = this;
    const LoanAccount = mongoose.models.LoanAccount;
    const Proposal = mongoose.models.Proposal;
    const User = mongoose.models.User;
    const Application = mongoose.models.Application;

    const handlers =  {
        getAnalytics(req, res, next) {

            if(req.user.role !== 'ADMIN') return handlers.getLenderBorrowerAnalytics(req, res, next);

            const weekDate = moment().add(-7, 'day').toDate();
            const newUserPromise = User.count({createdAt: {$gte: weekDate}, approved: true}).exec();
            const pendingUsersPromise = User.count({approved: false}).exec();
            const userTypePromise = User.aggregate([
                {$group: {_id: '$role', count: {$sum: 1}}}
            ]).exec();
            const totalApplicationsPromise = Application.count({}).exec();
            const applicationStatusCountPromise = Application.aggregate([
                {$group: {_id: '$status', count: {$sum: 1}}}
            ]);
            const loanAccountCount = LoanAccount.count({}).exec();
            const loanAmountPromise = LoanAccount.aggregate([
                {$group: {_id: '', total: {$sum: '$loanAmount'}}},
                {$project: {
                    _id: 0,
                    total: '$total'
                }}
            ]);
            //const applicationPcPromise =

            Promise.all([
                newUserPromise,
                pendingUsersPromise,
                userTypePromise,
                totalApplicationsPromise,
                applicationStatusCountPromise,
                loanAccountCount,
                loanAmountPromise]
            ).spread((newUsersCount, pendingUsersCount, usersTypeCount, totalAppCount, appStatus, totalLoanAcc, totalLoanAmount) => {
                res.send({
                    newUsersCount,
                    pendingUsersCount,
                    usersTypeCount,
                    totalAppCount,
                    appStatus,
                    totalLoanAcc,
                    totalLoanAmount: _.get(totalLoanAmount[0], 'total', 0)
                });
            }).catch(next);

        },

        getLenderBorrowerAnalytics(req, res, next) {
            const {role, _id} = req.user;
            const promises = [];

            if(role == constants.roles.BORROWER) {
                promises.push(Application.count({company: _id}).exec());
                promises.push(LoanAccount.count({borrower: _id}).exec());
                promises.push( LoanAccount.aggregate([
                    {$match: {borrower: _id}},
                    {$group: {_id: '', total: {$sum: '$loanAmount'}}},
                    {$project: {
                        _id: 0,
                        total: '$total'
                    }}
                ]));
                promises.push(Application.aggregate([
                    {$match: {company: _id}},
                    {$group: {_id: '$status', count: {$sum: 1}}}
                ]));
            } else if(role == constants.roles.LENDER) {
                promises.push(Application.count({account: {$exists: false}, lenders: {$in: [_id]}}).exec());
                promises.push(LoanAccount.count({'lenders.lender': _id}).exec());
                promises.push( LoanAccount.aggregate([
                    {$match: {'lenders.lender': _id}},
                    {$unwind: '$lenders'},
                    {$match: {'lenders.lender': _id}},
                    {$group: {_id: '', total: {$sum: '$lenders.loanAmount'}}},
                    {$project: {
                        _id: 0,
                        total: '$total'
                    }}
                ]));
                promises.push(Application.aggregate([
                    {$match: {lenders: {$in: [_id]}}},
                    {$group: {_id: '$status', count: {$sum: 1}}}
                ]));
            }

            Promise.all(promises).spread((totalAppCount, totalLoanAcc, totalLoanAmount, appStatus) => {
                res.send({
                    totalAppCount,
                    appStatus,
                    totalLoanAcc,
                    totalLoanAmount: _.get(totalLoanAmount[0], 'total', 0)
                });
            }).catch(next)
        },

        getBids(req, res, next) {
            const appId = req.params.id;
            Proposal.aggregate([
                {
                    $match: {application: appId}
                },
                {
                    $group: {
                        _id: { $dayOfYear: "$createdAt"},
                        bids: { $sum: 1 } }
                }
            ]).then(
                docs => {
                    const data = _.map(docs, d => {
                        d.date = moment().dayOfYear(d._id);
                        return d;
                    });
                    res.send(data);
                },
                next
            )
        },

        getApplications(req, res, next) {
            const q = {
                account: {$exists: false}
            };
            if(req.user.role == constants.roles.LENDER) {
                q.lenders = {$in: req.user._id};
            }
            Application.find(q).select('_id').exec().then(
                docs => res.send(docs),
                next
            );
        }
    };

    return handlers;
};