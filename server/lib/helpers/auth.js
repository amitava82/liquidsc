/**
 * Created by amitava on 11/04/16.
 */

var Promise = require('bluebird');
var Sendgrid  = require('sendgrid');

module.exports = function(deps){

    var sendgrid = Sendgrid(deps.config.get('sendGrid'));
    
    return {
        signup: function(data){

            var p = new deps.models.User(data);

            return p.validate()
                .then(
                    ()=> deps.models.User.count({email: data.email})
                )
                .then(
                    count => {
                        if(count > 0) throw new Error('An account with the email address exists');
                })
                .then(() => deps.models.User.createInvite(data))
                .then(
                    id => {
                        var grid = new sendgrid.Email({
                            to: data.email,
                            from: 'donotreplay@liquidsc.com',
                            fromname: 'liquidsc',
                            subject: 'Confirm your liquidsc account',
                            html: ' ',
                            text: ' '
                        });

                        grid.setFilters({
                            templates: {
                                settings: {
                                    enable: 1,
                                    template_id: '649cfe4b-769c-44e5-b550-83aedf64f4a0'
                                }
                            }
                        });

                        grid.setSubstitutions({
                            '-code-': [id]
                        });

                        return sendgrid.send(grid, function (err) {
                            if(err) deps.log.error(err);
                        });
                    }
                )
            
        }    
    }
    
};