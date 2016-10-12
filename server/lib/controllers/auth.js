/**
 * Created by amitava on 08/02/16.
 */


var uuid = require('uuid');
var Promise = require('bluebird');
var _ = require('lodash');
var passwordHelper = require('../helpers/password');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var constants = require('../../../constants');
var templates = require('../../../templates');

var EXTERNAL_HOST = process.env.EXTERNAL_HOST || 'http://localhost:3000';

module.exports = function(deps){

    var authHelper = require('../helpers/auth')(deps);
    var User = mongoose.models.User;
    var Session = mongoose.models.Session;


    return {

        oauthCallback: function(req, res, next){
            // var returnUrl = req.session.return;
            // if(returnUrl){
            //     delete req.session.return;
            // }else{
            //     returnUrl = '/';
            // }
            //
            // deps.passport.authenticate(req.params.module, {
            //     successRedirect: returnUrl,
            //     failureRedirect: '/login' }
            // )(req, res, next)
        },

        /*
        Local strategy
         */
        login: function(req, res, next){
            deps.passport.authenticate(req.params.module, {scope: ['email']}, function(err, user,info){
                if(err){
                    deps.middleware.apiError(err, req, res);
                }else if(!user){
                    deps.middleware.apiError(new Error(info.message), req, res);
                }else{
                    jwt.sign(user, deps.config.get('jwtSecret'), { algorithm: 'HS256' }, (err, token)  => {
                        if(err) {
                            deps.middleware.apiError(err, req, res);
                        } else {
                            res.cookie('authorization',token, { maxAge: 604800000, httpOnly: true });
                            return res.send(_.extend(user, {token}));
                        }
                    });
                }
            })(req, res, next);
        },

        logout: function(req, res){
            req.logout();
            res.cookie('authorization', null, { maxAge: 0, httpOnly: true });
            if(req.query.redirect){
                return res.redirect('/');
            }
            res.send({success: true});
        },

        signup: function (req, res, next) {
            var mailer = deps.nodemailer;
            var data = req.body;
            if(data.role === 'ADMIN'){
                return next(new Error('Invalid role'));
            }

            passwordHelper.hash(data.password, (err, pass) => {
                data.password = pass;

                User.create(data).then(
                    user => {
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: data.email,
                            subject: 'Registration success',
                            html: templates.signup(user)
                        });
                        return user;
                    }
                ).then(
                    () => res.send({success: true}),
                    next
                );
            });
        },

        currentSession(req, res, next) {
            res.send(req.user);

        },

        validate: function(req, res, next){
            var key = 'signup:' + req.params.code;

            deps.redis.get(key, function(err, data){
                if(err) return next(err);

                if(!data){
                    return res.status(400).redirect('/signup/error?code=NotFound');
                }

                var u = JSON.parse(data);

                deps.models.User.signup(u).then(
                    u => {
                        deps.redis.expire(key, 0, _.noop);
                        const user = u.toObject();
                        delete user.password;
                        delete user.salt;
                        req.login(user, loginErr => {
                            if (loginErr) {
                                return next(loginErr);
                            }
                            return res.redirect(user.role === 'USER' ? '/' : '/dashboard');
                        });
                    },
                    e => res.status(400).redirect('/signup/error?message='+e.message)
                )
            });
        },

        sendResetMail: function (req, res, next) {

            User.findOneAndUpdate({email: req.body.email}, {
                resetToken: uuid()
            }, {new: true}).exec().then(
                user => {
                    if(user) {
                        const url = `${EXTERNAL_HOST}/api/auth/reset-password/${user.resetToken}`;
                        const mail = (
                            `
                                <html>
                                    <body>
                                        <p>
                                            Click <a href="${url}">here</a> to reset password
                                        </p>
                                    </body>
                                </html>
                            `
                        );
                        var mailer = deps.nodemailer;
                        mailer.sendMail({
                            from: 'support@alchcapital.com',
                            to: req.body.email,
                            subject: 'Password reset',
                            html: mail
                        });
                    };
                    res.send({success: true})

                }
            ).catch(next);
        },

        resetPassword: function(req, res, next){
            var code = req.params.code;
            User.findOne({resetToken: code}).exec()
                .then(
                    user => {
                        if(!user) throw new Error('Invalid request');

                        res.render('reset-password', {title: 'Reset password', data: { code: code}});
                    }
                ).catch(e => renderError(res, e));
        },

        updatePassword: function(req, res){
            var code = req.body.code;

            if(!req.body.password || req.body.password !== req.body.confirmPassword)
                return res.render('reset-password', {title: 'Reset password', data: {code: code, error: 'Password do not match'}});

            User.findOne({resetToken: code}).exec().then(
                user => {
                    if(!user) throw new Error('Invalid request');

                    passwordHelper.hash(req.body.password, (err, hash) => {
                        if(err) throw err;

                        user.password = hash;
                        user.resetToken = null;

                        return user.save();
                    })
                }
            ).then(() => res.render('reset-password', {data: {success: true}, title: 'Reset password'})).catch(e => renderError(res, e));
        },

        /*
            /create-profile view for account creating
         */
        showSignup: function (req, res) {
            req.session._csrf = Date.now().toString(36);
            res.render('signup', {title: 'Signup - Careerraft', data: {}});
        },

        createSignup: function(req, res){
            var data = _.pick(req.body, 'email', 'name', 'password', 'kind');

            data.role = 'PROVIDER';

            authHelper.signup(data).then(
                r => {
                    res.render('signup', {title: 'Signup - Careerraft', data: {success: true}});
                },
                e => {
                    console.log(e)
                    res.render('signup', {title: 'Signup - Careerraft', data: {error: 'Please check your input'}});
                }
            )
        },

        createAdmin(req, res, next) {
            const data = req.body;
            User.findOne({role: 'ADMIN'}).exec().then(
                user => {
                    if(user) throw new Error('admin exists');

                    return new Promise((resolve, reject) => {
                        passwordHelper.hash(data.password, (err, pass) => {
                            if(err) {
                                reject(err);
                            } else {
                                data.password = pass;

                                User.create(data).then(resolve, reject);
                            }
                        })
                    })
                }
            ).then(
                () => res.send('OK'),
                next
            )
        }
    }
};

function renderError(res, e){
    res.render('error', {error: e.message, title: 'Error - Work alley'})
}