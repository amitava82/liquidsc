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
            LoanAccount.find(req.query).populate(['borrower', 'lender']).exec()
                .then(
                    docs => res.send(docs),
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