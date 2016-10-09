/**
 * Created by amitava on 12/07/16.
 */
var bcrypt = require('bcrypt-nodejs');

const saltRounds = 10;
module.exports = {
    hash: function (password, cb) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, null, cb);
        });
    },

    compare: function (password, hashed,cb) {
        bcrypt.compare(password, hashed, cb);
    }
};