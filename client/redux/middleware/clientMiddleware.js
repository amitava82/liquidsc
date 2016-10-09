/**
 * Created by amitava on 20/02/16.
 */

/*
Middleware that passes api client to promise middleware
 */
export default function clientMiddleware(client) {
    return ({dispatch, getState}) => {

        return next => action => {
            const {payload, type, ...rest } = action;
            const {session: {token, isLoggedIn}} = getState();

            if(payload && typeof payload.promise === 'function'){
                const headers = {};
                if(isLoggedIn){
                    headers['x-api-key'] = token;
                }
                action.payload.promise = payload.promise(client, headers);
            }

            return next(action);
        };
    };
}