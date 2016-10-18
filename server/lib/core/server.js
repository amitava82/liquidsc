var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var path = require('path');
var favicon = require('serve-favicon');
var engine = require('ejs-mate');
var mongoose = require('mongoose');
var constants = require('../../../constants');
var morgan = require('morgan');
var queryParser = require('express-query-int');


module.exports = function (dependencies, callback) {
    var jwt = require('../helpers/jwt')(dependencies);
    var app = express();

    app.use(morgan('dev'));
    app.use(compression());

    app.engine('ejs', engine);

    app.use(favicon(dependencies.basedir + '/public/favicon.ico'));

    app.use('/static', express.static(path.join(dependencies.basedir, "/public")));
    app.use('/static', express.static(path.join(dependencies.basedir, "/public/lib/font-awesome")));
    app.use('/static', function(req, res) {
        res.sendStatus(404);
    });
    app.use('/', express.static(path.join(dependencies.basedir, '/public')));
    app.set('views', path.resolve(dependencies.basedir, 'server/views'));
    app.set('view engine', 'ejs');

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(queryParser({
        parser: function(value, radix, name) {
            if (value.match(/^[0-9]+$/) != null) {
                return parseInt(value, radix);
            } else {
                return NaN;
            }
        }
    }));

    app.use(dependencies.middleware.authenticate, logErrors);


    //app.use(dependencies.passport.initialize());
   // app.use(dependencies.passport.session());

    app.get('/privacy', (req, res) => {
        res.render('privacy', {title: 'Privacy Policy'});
    });


    //delete cache buster
    app.use(function (req, res, next) {
        delete req.query._;
        next();
    });

    _.each(dependencies.routes, function (data, key) {
        var middleware = data.middleware || [];
        var basePath = data.path || '';

        _.each(data.routes, function (route) {
            var _path =  route.path.indexOf('/') === 0 ? route.path : (basePath + '/' + route.path),
                method = route.method,
                handler  = route.handler,
                acl = route.acl,
                _middlewares = [],
                middlewarefn = [];

            //first check for role definition
            if(acl){
                var aclFn = dependencies.middleware.acl(acl);
                middlewarefn.push(aclFn);
            }

            //common route middleware
            Array.prototype.push.apply(_middlewares, middleware || []);
            //route middleware
            Array.prototype.push.apply(_middlewares, route.middleware || []);

            _.reduce(_middlewares, function (memo, middlewareName) {
                var fn = dependencies.middleware[middlewareName];
                if(_.isFunction(fn) && _.indexOf(middlewarefn, fn) === -1) memo.push(fn);
                return memo;
            }, middlewarefn);

            var _handlerFn = dependencies.controllers[key][handler];

            if(_.isArray(_handlerFn)){
                Array.prototype.push.apply(middlewarefn, _handlerFn);
            }else if(_.isFunction(_handlerFn)){
                middlewarefn.push(_handlerFn);
            }else {
                throw new Error('Controller function not defined: ' + key + ' ' + handler);
            }

            app[method].call(app, _path, middlewarefn);
        });
    });

    app.use('/api/*', dependencies.middleware.apiError);

    app.all('/api/*', function (req, res) {
        res.status(404).send('Invalid route');
    });

    function logErrors(err, req, res, next) {
        dependencies.log.error(err);
        renderError(res, err);
    }

    app.all("*", logErrors);
    app.all('*', (req, res) => {
        res.sendFile(path.join(dependencies.basedir, "/public/index.html"));
    });

    //var client = require('../../client/scripts/server')(dependencies, app, _.noop);

    callback(null, app);
};


function renderError(res, e){
    res.render('error', {error: e.message, title: 'Error - liquidSC'})
}