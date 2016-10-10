import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import errorMessage from './error';
import toast from './toast';
import session from './session';
import users from './users';
import applications from './applications';
import loanAccounts from './loanAccounts';

export default combineReducers({
    errorMessage,
    toast,
    session,
    users,
    applications,
    loanAccounts,
    routing: routerReducer,
    form: formReducer
});