/**
 * Created by amita on 10/9/2016.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var shortid = require('shortid');
var _ = require('lodash');
var constants = require('../../../constants');
var uid = require('../helpers/id');

module.exports = function (deps) {
    const model = 'Application';

    const applicationSchema = mongoose.Schema({
        //borrower input fields
        _id: {
            type: String
        },

        company: {
            type: String,
            ref: 'User',
            required: true
        },

        loanAmount: {
            type: Number,
            required: true
        },

        rateOfInterest: {
            type: Number,
            required: true
        },

        tenor: {
            type: Number,
            required: true
        },

        receivable: {
            type: Number,
            required: true
        },

        receivableDate: {
            type: Date,
            required: true
        },

        buyerCompany: {
            type: String,
            required: true
        },

        buyerContactPerson: {
            type: String,
            required: true
        },

        buyerEmail: {
            type: String,
            required: true
        },

        buyer: {
          type: String,
          ref: 'User'
        },

        buyerConsent: {
            type: Boolean,
            required: true
        },

        isExporter: {
            type: Boolean,
            required: true,
            default: false
        },

        documents: [],

        receivableStatus: {
            type: String,
            default: 'pending',
            enum:['approved', 'pending', 'rejected']
        },

        loanAccount: {
          type: String,
          ref: 'Loan'
        },

        status: {
            type: String,
            required: true,
            enum: Object.keys(constants.status)
        },

        lenders: [{
            type: String,
            ref: 'User'
        }],

        account: {
            type: String,
            ref: 'LoanAccount'
        },

        adminComment: String

    }, {timestamps: true});

    applicationSchema.pre('save', function(next) {
        if(this.isNew)
            this._id = uid('app');
        next();
    });

    return mongoose.model(model, applicationSchema);
};