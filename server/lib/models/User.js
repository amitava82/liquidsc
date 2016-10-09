/**
 * Created by amitava on 10/02/16.
 */
var mongoose = require('mongoose');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var uuid = require('uuid');
var _ = require('lodash');

module.exports = function (deps) {

    const model = 'User';

    var userSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

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
            required: true,
            index: true,
            unique: true
        },

        occupation: String,

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ['USER', 'ADMIN', 'PROVIDER'],
            default: 'USER',
            required: true
        },
        
        oauthID: {
            type: String,
            index: 1,
            unique: 1
        },
        
        active: {
            type: Boolean,
            required: true,
            default: true
        }

    }, {timestamps: true});

    return mongoose.model(model, userSchema);
};