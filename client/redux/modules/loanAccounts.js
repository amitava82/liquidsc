/**
 * Created by amita on 10/10/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';



import createAction from '../createActions';

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

const [LOAD_ACCOUNTS, GET_ACCOUNT, UPDATE] = createAction('accounts', ['LOAD_ACCOUNTS', 'GET_ACCOUNT', 'UPDATE']);

export default function (state = initialState, action) {
    const {payload, type, meta} = action;

    switch (type) {
        case resolve(LOAD_ACCOUNTS):
            return {...state,
                query: meta.query,
                data: payload.docs,
                total: payload.total,
                limit: payload.limit,
                pages: payload.pages,
                page: payload.page,
                loading: false
            };

        case resolve(UPDATE):
            return {...state, data: state.data.map(i => i._id == payload._id ? payload : i)};

        case GET_ACCOUNT:
            return {...state, viewing: null};

        case resolve(GET_ACCOUNT):
            return {...state, viewing: payload};

        default:
            return state;
    }
}

export const getAccount = (id) => ({
   type: GET_ACCOUNT,
    payload: {
       promise: api => api.get(`accounts/${id}`)
    }
});

export const loadAccounts = (query) => ({
    type: LOAD_ACCOUNTS,
    payload: {
        promise: api => api.get('accounts', {params:query }),
        query
    }
});

export const updateAccount = (id, loanId, disbursementDate) => ({
    type: UPDATE,
    payload: {
        promise: api => api.put(`accounts/${id}`, {data: {loanId, disbursementDate}})
    }
});

export const settleAccount = id => ({
    type: UPDATE,
    payload: {
        promise: api => api.put(`accounts/${id}/settle`)
    }
});