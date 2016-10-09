import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';

import createAction from '../createActions';

const [STORE_SESSION, LOGIN, LOGOUT, SIGNUP, SET_PASSWORD, UPDATE_PROFILE, SHOW_NAV] =
    createAction('session', ["STORE_SESSION", "LOGIN", "LOGOUT", "SIGNUP", "SET_PASSWORD", "UPDATE_PROFILE", "SHOW_NAV"]);

const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    showNav: false
};

export default function(state = initialState, action = {}){
    switch (action.type){
        case STORE_SESSION:
        case resolve(STORE_SESSION):
            return extend({}, state, {
                user: action.payload,
                isLoggedIn: !!action.payload,
                loading: false,
                error: null
            });

        case LOGIN:
            return extend({}, state, {
                loading: true,
                user: null,
                token: null,
                isLoggedIn: false,
                error: null
            });

        case UPDATE_PROFILE:
            return extend({}, state, {
                error: null,
                loading: true
            });

        case _reject(LOGIN):
        case _reject(UPDATE_PROFILE):
            return extend({}, state, {
                loading: false,
                isLoggedIn: false,
                error: action.payload
            });

        case resolve(LOGIN):
            return extend({}, state, {
                loading: false,
                user: action.payload,
                error: null,
                isLoggedIn: !!action.payload
            });

        case resolve(UPDATE_PROFILE):
            return extend({}, state, {
                user: action.payload,
                error: null,
                loading: false
            });
        
        case LOGOUT:
            return extend({}, state, initialState);

        case LOCATION_CHANGE:
            return {...state, showNav: false};

        case SHOW_NAV:
            return {...state, showNav: !state.showNav};

        default:
            return state;
    }
}

export function storeSession(session){
    return {
        type: STORE_SESSION,
        payload: session
    }
}

export function getSession() {
    return {
        type: STORE_SESSION,
        payload: {
            promise: api => api.get('auth/current')
        }
    }
}

export function doLogin(data) {
    return {
        type: LOGIN,
        payload: {
            promise: (api) => api.post('auth/login/local', {
                data
            })
        }
    }
}

export function signup(data) {
    return {
        type: SIGNUP,
        payload: {
            promise: api => api.post('auth/signup', {
                data
            })
        }
    }
}

export function logout(){
    return {
        type: LOGOUT
    }
}

export function requestResetPassword(email) {
    return {
        type: "REQUEST_RESET",
        payload: {
            promise: api => api.post(`auth/reset`, {data: {email}})
        }
    }
}

export function resetPassword(password, code) {
    return {
        type: SET_PASSWORD,
        payload: {
            promise: api => api.post(`/auth/password/reset`, {
                data: {
                    code,
                    password
                },
                prefix: false
            })
        }
    }
}

export function updateProfile(profile) {
    return {
        type: UPDATE_PROFILE,
        payload: {
            promise: api => api.post('users/profile', {
                data: profile
            })
        }
    }
}

export function showNav() {
    return {
        type: SHOW_NAV
    }
}