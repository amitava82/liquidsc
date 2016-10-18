/**
 * Created by amita on 10/9/2016.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var shortid = require('shortid');
var _ = require('lodash');
var uid = require('../helpers/id');

module.exports = function (deps) {
    const model = 'LoanAccount';

    const lenderSchema = mongoose.Schema({
        lender: {
            type: String,
            ref: 'User',
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
        },
    });

    const loanSchema = mongoose.Schema({
        _id: {
            type: String
        },

        borrower: {
            type: String,
            ref: 'User',
            required: true
        },

        lenders: [ lenderSchema ],

        loanAmount: Number,

        application: {
            type: String,
            ref: 'Application',
            required: true,
            index: {unique: true}
        }
    }, {timestamps: true});


    loanSchema.pre('save', function(next) {
        if(this.isNew)
            this._id = uid('loan');
        next();
    });

    loanSchema.plugin(mongoosePaginate);

    return mongoose.model(model, loanSchema);

};