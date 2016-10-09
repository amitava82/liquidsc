/**
 * Created by amita on 9/18/2016.
 */
var jwt = require('jsonwebtoken');

module.exports = (deps) => {
    const secret = deps.config.get('jwtSecret');

    return (req, res, next) => {
        const token = req.headers.authorization || req.cookies.authorization;
        if(!token) return next();

        jwt.verify(token, secret, function(err, decoded) {
            if(err){
                res.cookie('authorization',null, { maxAge: -1, httpOnly: true });
                next(err);
            } else {
                req.user = decoded;
                req.user.token = token;
                next();
            }
        });
    }
};