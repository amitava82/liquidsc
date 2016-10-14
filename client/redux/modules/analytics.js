/**
 * Created by amita on 10/14/2016.
 */
import { resolve, reject as _reject } from '../middleware/simple-promise';
import { LOCATION_CHANGE } from 'react-router-redux';
import extend from 'lodash/extend';
import Promise from 'bluebird';
import reject from 'lodash/reject';


import createAction from '../createActions';

const [ LOAD ] = createAction('analytics', ["LOAD"]);

const initialState = {
    data: {}
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case resolve(LOAD):
            return {...state, data: payload};

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