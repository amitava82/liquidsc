/**
 * Created by amitava on 10/02/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var uuid = require('uuid');
var _ = require('lodash');
var constants = require('../../../constants');

module.exports = function (deps) {

    const model = 'User';

    var userSchema = mongoose.Schema({

        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        phone: {
            type: Number,
            required: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: _.keys(constants.roles),
            default: 'SUPPLIER',
            required: true
        },

        fullName: {
            type: String
        },

        company: String,

        lenderType: String,

        designation: String,

        comments: String,

        pan: String,

        contactPerson: String,

        businessType: String,

        approved: {
            type: Boolean,
            required: true,
            default: false
        },
        
        active: {
            type: Boolean,
            required: true,
            default: true
        }

    }, {timestamps: true});

    return mongoose.model(model, userSchema);
};