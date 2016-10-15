/**
 * Created by amita on 10/9/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';

import createAction from '../createActions';

const [GET_USERS, APPROVE_USER, REJECT_USER, GET_LENDERS] =
    createAction('users', ["GET_USERS", "LOGIN", "APPROVE_USER", "REJECT_USER", "GET_LENDERS"]);

const initialState = {
    data: [],
    lenders: [],
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
        case GET_USERS:
            return {...state, loading: true, error: null};

        case resolve(GET_USERS):
            return {...state,
                query: meta.query,
                data: payload.docs,
                total: payload.total,
                limit: payload.limit,
                pages: payload.pages,
                page: payload.page,
                loading: false
            };

        case resolve(APPROVE_USER):
            return {...state, data: reject(state.data, {_id: meta.id})};

        case resolve(GET_LENDERS):
            return {...state, lenders: payload};

        default:
            return state;

    }
}

export const getUsers = (query, page) => ({
    type: GET_USERS,
    payload: {
        promise: api => api.get('users', {params: query}),
        query
    }
});

export const approveUser = id => ({
    type: APPROVE_USER,
    payload: {
        promise: api => api.post(`users/${id}/approve`),
        id
    }
});

export const getLenders = () => {
   return (dispatch, getState) => {

       const lenders = getState().users.lenders;

       if(lenders.length) return lenders;

       dispatch({
           type: GET_LENDERS,
           payload: {
               promise: api => api.get('users/lenders/list')
           }
       })
   }
};