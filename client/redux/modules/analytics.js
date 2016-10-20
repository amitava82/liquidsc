/**
 * Created by amita on 10/14/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';


import createAction from '../createActions';

const [ LOAD, LOAD_BIDS, LOAD_APPS ] = createAction('analytics', ["LOAD", "LOAD_BIDS", "LOAD_APPS"]);

const initialState = {
    data: {},
    bids: [],
    applications: []
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case resolve(LOAD):
            return {...state, data: payload};

        case resolve(LOAD_BIDS):
            return {...state, bids: payload};

        case resolve(LOAD_APPS):
            return {...state, applications: payload};

        default:
            return state;
    }
}

export const loadAnalytics = () => ({
    type: LOAD,
    payload: {
        promise: api => api.get('analytics')
    }
});

export const loadBids = id => ({
    type: LOAD_BIDS,
    payload: {
        promise: api => api.get(`analytics/${id}/bids`)
    }
});

export const loadApplications = () => ({
    type: LOAD_APPS,
    payload: {
        promise: api => api.get(`analytics/applications`)
    }
});