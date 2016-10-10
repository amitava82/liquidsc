/**
 * Created by amita on 10/9/2016.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var shortid = require('shortid');
var _ = require('lodash');
var uid = require('../helpers/id');

module.exports = function (deps) {
    const model = 'LoanAccount';

    const loanSchema = mongoose.Schema({
        _id: {
            type: String
        },

        lender: {
            type: String,
            required: true
        },

        loanAmount: {
            type: Number,
            required: true
        },

        interestRate: {
            type: Number,
            required: true
        },

        tenor: {
            type: Number,
            required: true
        },

        disbursementDate: {
            type: Date
        },

        repaymentDate: {
            type: Date
        }
    });

    loanSchema.pre('save', function(next) {
        this._id = uid('loan');
        next();
    });

    return mongoose.model(model, loanSchema);

};