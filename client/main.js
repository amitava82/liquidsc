/**
 * Created by amitava on 07/09/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory, applyRouterMiddleware} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import Client from './client';
import createStore from './redux/createStore';
import apiClient from './utils/api';
import routes from './routes';

const store = createStore(undefined, new apiClient());
const history = syncHistoryWithStore(browserHistory, store);

const root = document.getElementById('app');

const _routes = routes(store);

ReactDOM.render((
    <Client store={store} history={history} routes={_routes} />
), root);
