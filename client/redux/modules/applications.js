/**
 * Created by amita on 10/9/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';


import createAction from '../createActions';

const [GET_APPLICATIONS, GET_APPLICATION, CREATE, REJECT_APPLICATION, ASSIGN_LENDER,
    BUYER_CHANGE_STATUS, SUBMIT_PROPOSAL, CREATE_LOAN_ACCOUNT, UPDATE_APPLICATION] =
    createAction('applications', [
        "GET_APPLICATIONS",
        "GET_APPLICATION",
        "CREATE",
        "REJECT_APPLICATION",
        "ASSIGN_LENDER",
        "BUYER_CHANGE_STATUS",
        "SUBMIT_PROPOSAL",
        "CREATE_LOAN_ACCOUNT",
        "UPDATE_APPLICATION"
    ]);

const initialState = {
    data: [],
    viewing: null,
    loading: false,
    error: null,
    query: {},
    limit: 10,
    total: 0,
    pages: 1,
    page: 1,
    sortBy: 'company',
    order: 1
};

export default function (state = initialState, action) {
    const {payload, type, meta} = action;
    switch (type) {
        case GET_APPLICATION:
            return {...state, viewing: null};

        case resolve(GET_APPLICATION):
            return {...state, viewing: payload};

        case resolve(GET_APPLICATIONS):
            return {...state,
                query: meta.query,
                data: payload.docs,
                total: payload.total,
                limit: payload.limit,
                pages: payload.pages,
                page: payload.page,
                loading: false
            };

        case resolve(CREATE):
            return {...state, data: [...state.data, payload]};

        case resolve(BUYER_CHANGE_STATUS):
            return {...state, data: state.data.map(i => i._id == payload._id ? payload : i)};

        case resolve(ASSIGN_LENDER):
        case resolve(UPDATE_APPLICATION):
            return {...state, viewing: {...state.viewing, ...payload}};

        case resolve(CREATE_LOAN_ACCOUNT):
            return {...state, viewing: payload};

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
        promise: api => api.get('applications', {params: query}),
        query
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
       promise: api => api.put(`applications/${id}`, {data: {receivableStatus: status}})
    }
});

export const submitProposal = (id, data) => ({
    type: SUBMIT_PROPOSAL,
    payload: {
        promise: api => api.post(`applications/${id}/proposals`, {data})
    }
});

export const createLoanAccount = (proposalId) => ({
    type: CREATE_LOAN_ACCOUNT,
    payload: {
        promise: api => api.post(`applications/proposals/${proposalId}/approve`)
    }
});

export const requestDetails = (id, adminComment) => ({
    type: UPDATE_APPLICATION,
    payload: {
        promise: api => api.put(`applications/${id}`, {data: {adminComment}})
    }
});

export const changeStatus = (id, status) => ({
    type: UPDATE_APPLICATION,
    payload: {
        promise: api => api.put(`applications/${id}`, {data: {status}})
    }
});