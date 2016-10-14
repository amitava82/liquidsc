/**
 * Created by amita on 10/14/2016.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var constants = require('../../../constants');

module.exports = deps => {
    const LoanAccount = mongoose.models.LoanAccount;
    const Proposal = mongoose.models.Proposal;
    const User = mongoose.models.User;
    const Application = mongoose.models.Application;

    return {
        getAnalytics(req, res, next) {
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
                    totalLoanAmount: totalLoanAmount[0].total
                });
            }).catch(next);

        }
    }
};