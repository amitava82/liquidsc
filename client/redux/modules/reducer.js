import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import errorMessage from './error';
import toast from './toast';
import session from './session';


export default combineReducers({
    errorMessage,
    toast,
    session,
    routing: routerReducer,
    form: formReducer
});