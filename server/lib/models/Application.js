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

module.exports = function (deps) {
    const model = 'Application';

    const docSchema = mongoose.Schema({});

    const applicationSchema = mongoose.Schema({
        company: {
            type: String,
            required: true
        },

        receivable: {
            type: Number,
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

        isExporter: {
            type: Boolean,
            required: true,
            default: false
        },

        paymentDate: {
            type: Date
        },

        documents: [],

        buyerValidated: {
            type: Boolean,
            default: false,
            required: true
        },

        processingFees: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: Object.keys(constants.status)
        }

    }, {timestamps: true});


    return mongoose.model(model, applicationSchema);
};