/*
 * Entry point for the application
 *
 */

var async = require('async');
var config = require('config');
var routes = require('./server/routes');
var _  = require('lodash');

global.__CLIENT__ = false;
global.__SERVER__ = true;

var deps = {
    basedir: __dirname,
    config: config,
    routes: routes,
    controllers: null,
    middleware: null,
    log: null,
    server: null
};

require('./server/lib/models')(deps);

deps.passport = require('./server/lib/core/passport')(deps);

require('./server/lib')(deps);

//Load core modules. Loaded asynchronously.
async.eachSeries([
    'log',
    'nodemailer',
    'db',
    'app',
    'passport',
], function(item, done){
    var fn = require('./server/lib/core/'+item)(deps);

    if(_.isFunction(fn)){
        fn(function (err, result) {
            if(err) return done(err);

            deps[item] = result;
            done(null, result);

        })
    }else {
        process.nextTick(function(){
            deps[item] = fn;
            done(null, fn);
        });
    }

}, function (err, results) {
    if(err){
        //Core modules failed to load. Shutdown process
        console.log(err);
        process.exit(1);
    }

    deps.app.listen(config.get('ui.port'), function () {
        console.log('app running on: ', config.get('ui.port'));
    });
});



