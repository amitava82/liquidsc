/**
 * Created by amitava on 08/09/16.
 */
var _ = require('lodash');

module.exports = function (deps) {

    return function(acl){
        return function(req, res, next){
            if(req.user && (_.isArray(acl.role) ? role.indexOf(req.user.role) > -1 : req.user.role  === acl.role)) return next();

            res.status(403).send({
                message: "You do not have permission to view this resource.",
                error: 'NoAccess',
                code: 403
            });
        };
    }
};