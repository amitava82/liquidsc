/**
 * Created by amita on 10/10/2016.
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
    const model = 'Proposal';

    const proposalSchema = mongoose.Schema({
        _id: {
            type: String
        },

        lender: {
            type: String,
            ref: 'User'
        },

        application: {
            type: String,
            ref: 'Application'
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

        status: {
            type: String,
            enum: ['approved', 'pending', 'rejected'],
            default: 'pending'
        },

        comment: String

    }, {timestamps: true});

    proposalSchema.pre('save', function(next) {
        this._id = uid('proposal');
        next();
    });

    return mongoose.model(model, proposalSchema);
};