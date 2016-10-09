/**
 * Created by amitava on 11/02/16.
 * API Error middleware. Used for API endpoints to send JSON error
 */
var _ = require('lodash');

module.exports = function (deps) {
    return function(err, req, res, next){
        if(err){
            if(err.name === 'ValidationError'){
                var errors = {
                    _error: 'Validation failed.',
                    message: err.message
                };
                _.reduce(err.errors, (memo, e) => {
                    _.set(memo, e.path, e.message);
                    //memo[e.path] = e.message;
                    return memo;
                }, errors);

                res.status(400).send(errors);

            } else {
                console.log(err);
                res.status(err.status || 400).send({
                    _error: err.message,
                    error: err.name,
                    message: err.message
                });
            }
        }else{
            next();
        }
    }
};