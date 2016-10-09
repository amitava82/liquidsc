/**
 * Created by amitava on 03/09/16.
 */

var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

module.exports = function (deps) {

    var files = fs.readdirSync(__dirname);

    files.forEach(file => {
        var f = path.basename(file, '.js');

        if(f != 'index'){
            console.log('loading model ', f);
            require(path.resolve(__dirname, file))(deps)
        }
    });
};