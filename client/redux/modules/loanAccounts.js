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
    loading: false,
    error: null
};

const [LOAD_ACCOUNTS, UPDATE] = createAction('accounts', ['LOAD_ACCOUNTS', 'UPDATE']);

export default function (state = initialState, action) {
    const {payload, type} = action;

    switch (type) {
        case resolve(LOAD_ACCOUNTS):
            return {...state, data: payload};

        case resolve(UPDATE):
            return {...state, data: state.data.map(i => i._id == payload._id ? payload : i)};

        default:
            return state;
    }
}

export const loadAccounts = () => ({
    type: LOAD_ACCOUNTS,
    payload: {
        promise: api => api.get('accounts')
    }
});

export const updateAccount = (id, disbursementDate) => ({
    type: UPDATE,
    payload: {
        promise: api => api.put(`accounts/${id}`, {data: {disbursementDate}})
    }
});