/**
 * Created by amitava on 03/09/16.
 */
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');
var ObjId = mongoose.Types.ObjectId;
var templates = require('../../../templates');

module.exports = deps => {
    const User = mongoose.models.User;
    return {

        getUsers(req, res, next) {
            if(req.params.id){
                User.findById(req.params.id).exec().then(
                    doc => res.send(doc),
                    next
                )
            } else {
                const q = req.query;
                const page = q.page || 1;
                delete q.page;
                User.paginate(q, {page}).then(
                    docs => res.send(docs),
                    next
                )
            }
        },

        updateProfile(req, res, next) {
            
        },

        approveUser(req, res, next) {
            User.findByIdAndUpdate(req.params.id, {approved: true, approvedAt: new Date()}, {new: true}).exec().then(
                user => {
                    var mailer = deps.nodemailer;
                    mailer.sendMail({
                        from: 'support@alchcapital.com',
                        to: user.email,
                        subject: 'ALCH : Registration Request Approved',
                        html: templates.accountActivated({user})
                    });
                    return user;
                }
            ).then(
                user => res.send(user),
                next
            )
        },

        getLenders(req, res, next) {
            User.find({role: 'LENDER', approved: true}).select('_id, fullName, company').exec().then(
                docs => res.send(docs),
                next
            )
        }
    }
};