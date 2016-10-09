/**
 * Created by amitava on 12/07/16.
 */
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var juice = require('juice');

var css = fs.readFileSync(path.resolve(__dirname, './css/style.css'), 'utf8');

//var resetHtml = fs.readFileSync(path.resolve(__dirname, './reset-password.html'), 'utf8');
var signupHtml = fs.readFileSync(path.resolve(__dirname, './signup.html'), 'utf8');
var accountActivatedHtml = fs.readFileSync(path.resolve(__dirname, './account-activated.html'), 'utf8');
var docRequested = fs.readFileSync(path.resolve(__dirname, './doc-requested.html'), 'utf8');
var applicationStatus = fs.readFileSync(path.resolve(__dirname, './application-status.html'), 'utf8');
var applicationReceived = fs.readFileSync(path.resolve(__dirname, './application-received.html'), 'utf8');


var EXTERNAL_HOST = process.env.EXTERNAL_HOST || 'http://localhost:3000';

const templates = {
    signup: signupHtml,
    accountActivated: accountActivatedHtml,
    applicationStatus: applicationStatus,
    applicationReceived: applicationReceived,
    docRequested: docRequested
};

_.each(templates, (val, key) => {
    const fn = _.template(val);
    module.exports[key] = (data) => juice.inlineContent(fn(_.extend(data, {host: EXTERNAL_HOST})), css);
});
