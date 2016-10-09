import { createStore, applyMiddleware } from 'redux';
import {browserHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';
import promiseMiddleware from './middleware/simple-promise';
import thunk from 'redux-thunk';

import reducer from './modules/reducer';
import clientMiddleware from './middleware/clientMiddleware';

export default function (initialState, apiClient) {
    const createStoreWithMiddleware = applyMiddleware(thunk, clientMiddleware(apiClient), promiseMiddleware(), routerMiddleware(browserHistory))(createStore);
    return createStoreWithMiddleware(reducer, initialState);
}
