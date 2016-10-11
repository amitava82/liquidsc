import React from 'react';
import {Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';


import Home from './containers/home';
import Login from './containers/login';
import Reset from './containers/forgot/PasswordReset';
import Signup from './containers/signup';
import Application from './containers/application';
import Admin from './containers/admin';
import Lender from './containers/lender';
import Account from './containers/account';

import NotFound from './containers/misc/NotFound';

import App from './app';


export default (store) => {

    function ensureLoggedIn(nextState, replace, cb) {
        const {session: {isLoggedIn, user}} = store.getState();
        if (!isLoggedIn) {
            replace({pathname: '/login'});
        }
        cb();
    }

    const checkRole = (role) => (nextState, replace, cb) => {
        const {session: {isLoggedIn, user}} = store.getState();
        if (!isLoggedIn) {
            replace({pathname: '/login'});
        }else {
            if(user.role != role) {
                replace({pathname: '/home'});
            }
        }
        cb();
    };

    return (
        <Route path="/" component={App}>
            <IndexRedirect to="/login" />
            <Route path="login" component={Login}/>
            <Route path="forgot" component={Reset}/>
            <Route path="signup" component={Signup}/>
            <Route path="home" component={Home} onEnter={ensureLoggedIn} />
            <Route path="application/create" component={Application} onEnter={checkRole('BORROWER')} />
            <Route path="/admin" onEnter={checkRole('ADMIN')}>
                <Route path="applications" component={Admin.Applications} />
                <Route path="applications/:id" component={Admin.ApplicationDetails} />
                <Route path="accounts" component={Admin.LoanAccounts} />
                <Route path="accounts/:account" component={Admin.LoanAccountDetails} />
            </Route>
            <Route path="/lender" onEnter={checkRole('LENDER')}>
                <Route path="applications/:id" component={Lender.SubmitProposal} />
            </Route>
            <Route path="*" component={NotFound}/>
        </Route>
    );
};