/**
 * Created by amita on 10/9/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';


import createAction from '../createActions';

const [GET_APPLICATIONS, CREATE, REJECT_USER] =
    createAction('applications', ["GET_APPLICATIONS", "CREATE", "APPROVE", "REJECT"]);

const initialState = {
    data: [],
    loading: false,
    error: null
};

export default function (state = initialState, action) {
    const {payload, type} = action;
    switch (type) {
        case resolve(GET_APPLICATIONS):
            return {...state, data: payload};

        case resolve(CREATE):
            return {...state, data: [...state.data, payload]};

        default:
            return state;
    }
}

export const createApplication = data => {
    const {documents, ...rest} = data;
    const files = [];
    Object.keys(documents).forEach(key => {
        const f = documents[key];
        if(f)  files.push({field: key, value: f[0]})
    });


    return {
        type: CREATE,
        payload: {
            promise: api => api.post('applications', {data: rest, files })
        }
    }
};

export const getApplications = query => ({
    type: GET_APPLICATIONS,
    payload: {
        promise: api => api.get('applications', {params: query})
    }
});