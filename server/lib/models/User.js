/**
 * Created by amitava on 10/02/16.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var ObjId = mongoose.Schema.Types.ObjectId;
var passwordHelper = require('../helpers/password');
var Promise = require('bluebird');
var uid = require('../helpers/id');
var _ = require('lodash');
var constants = require('../../../constants');

module.exports = function (deps) {

    const model = 'User';

    var userSchema = mongoose.Schema({

        _id: {
            type: String
        },

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

        sector: String,

        subSector: String,

        designation: String,

        comments: String,

        pan: String,

        contactPerson: String,

        businessType: String,

        country: String,

        city: String,

        address: String,

        phoneCode: String,

        resetToken: {
            type: String,
            index: 1
        },

        approved: {
            type: Boolean,
            required: true,
            default: false
        },

        approvedAt: Date,
        
        active: {
            type: Boolean,
            required: true,
            default: true
        }

    }, {timestamps: true});

    userSchema.pre('save', function(next) {
        if(this.isNew)
            this._id = uid(this.role, 1);
        next();
    });

    userSchema.plugin(mongoosePaginate);

    return mongoose.model(model, userSchema);
};