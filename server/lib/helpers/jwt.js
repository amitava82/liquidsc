/**
 * Created by amita on 9/21/2016.
 */
var jwt = require('jsonwebtoken');
module.exports = deps => {
    const secret = deps.config.get('jwtSecret');
    return {
        verify(token, cb) {
            jwt.verify(token, secret, cb);
        }
    }
};