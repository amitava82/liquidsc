/**
 * Created by amitava on 09/02/16.
 */
var mongoose = require('mongoose');
var config = require('config');
var _ = require('lodash');
var url = require('url');
var shortid = require('shortid');
var passwordHelper = require('../helpers/password');


const SESSION_ITEMS = '';

module.exports = function(deps){
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    function callbackUrl(module){
        var port = deps.config.get('ui.port');
        return url.format({
            hostname: deps.config.get('ui.host'),
            port:  (port == 80 || port == 443) ? "" : deps.config.get('ui.port'),
            protocol: deps.config.get('ui.protocol'),
            pathname: 'auth/'+module+'/callback'
        });
    }

    function _callback(accessToken, refreshToken, profile, cb){
        var User = mongoose.models.User;
        var email = _.get(profile, 'emails[0].value', '');
        var oauthId = profile.id;
        var photo = _.get(profile, 'photos[0].value');

        User.findOne({$or: [{oauthID: oauthId},{email: email}]}, {lean: true}, (err, user) => {
            if(err){
                cb(err);
            }else if(!err && user !== null) {
                //We are updating profile pic if it's available and has changed.
                if(photo && (user.photo !== photo)){
                        user.photo = photo;
                        user.save(function(err){
                            if(err) return cb(err);
                            cb(null, user);
                        });
                }else{
                    cb(null, user);
                }
            } else {
                User.create({
                    name: profile.displayName,
                    oauthID: oauthId,
                    email: email,
                    photo: photo,
                    password: shortid()
                }).then(
                    res => cb(null, res),
                    e => cb(e)
                );
            }
        });
    }

    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
       function(email, password, done){

           mongoose.models.User.findOne({email: email.toLowerCase()}).select('+password').lean().then(
               user => {
                   if(!user){
                       return done(null, false, { message: 'Incorrect username or password.' });
                   }

                   passwordHelper.compare(password, user.password, (err, valid) => {
                       if(err) {
                           done(err);
                       } else {
                           if(valid) {
                               return done(null, user);
                           } else {
                               return done(null, false, { message: 'Incorrect username or password.' });
                           }
                       }
                   });
               },
               e => {
                   if (e) { return done(e); }
               }
           )
       }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user._id);
    });

    passport.deserializeUser(function(id, cb) {
        var User = mongoose.models.User;
        User.findById(id).lean().exec(cb);
    });

    return passport;
};