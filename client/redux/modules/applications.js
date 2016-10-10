/**
 * Created by amita on 10/9/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';


import createAction from '../createActions';

const [GET_APPLICATIONS, GET_APPLICATION, CREATE, REJECT_APPLICATION, ASSIGN_LENDER, BUYER_CHANGE_STATUS] =
    createAction('applications', ["GET_APPLICATIONS", "GET_APPLICATION", "CREATE", "REJECT_APPLICATION", "ASSIGN_LENDER", "BUYER_CHANGE_STATUS"]);

const initialState = {
    data: [],
    viewing: null,
    loading: false,
    error: null
};

export default function (state = initialState, action) {
    const {payload, type} = action;
    switch (type) {
        case GET_APPLICATION:
            return {...state, viewing: null};

        case resolve(GET_APPLICATION):
            return {...state, viewing: payload};

        case resolve(GET_APPLICATIONS):
            return {...state, data: payload};

        case resolve(CREATE):
            return {...state, data: [...state.data, payload]};

        case resolve(BUYER_CHANGE_STATUS):
        case resolve(ASSIGN_LENDER):
            return {...state, data: state.data.map(i => i._id == payload._id ? payload : i)};


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

export const getApplication = id => ({
    type: GET_APPLICATION,
    payload: {
        promise: api => api.get(`applications/${id}`)
    }
});

export const rejectApplication = id => ({
    type: REJECT_APPLICATION,
    payload: {
        promise: api => api.post(`applications/${id}/reject`)
    }
});

export const assignToLenders = (id, lenders) => ({
    type: ASSIGN_LENDER,
    payload: {
        promise: api => api.post(`applications/${id}/assign`, {data: lenders})
    }
});

export const buyerChangeStatus = (id, status) => ({
   type:  BUYER_CHANGE_STATUS,
    payload: {
       promise: api => api.post(`applications/${id}/buyer/${status}`)
    }
});