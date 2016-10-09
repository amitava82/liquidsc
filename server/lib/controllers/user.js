/**
 * Created by amitava on 03/09/16.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');
var ObjId = mongoose.Types.ObjectId;

module.exports = deps => {
    const User = mongoose.models.User;
    return {

        getUser(req, res, next) {
            const id = req.params.id;
            const userPromise = User.findById(id).lean().exec();

            userPromise.then(
                user => res.send(user),
                next
            );
        },

        updateProfile(req, res, next) {
            
        }
    }
};