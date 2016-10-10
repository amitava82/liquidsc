import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import {logout} from './redux/modules/session';
import Toastr from './utils/toastr';
import Header from './components/header';
import { events } from '../constants';


import { createToast } from './redux/modules/toast';
import './scss/export.scss';
require('react-datepicker/dist/react-datepicker.css');

@connect(state => state)
export default class App extends React.Component {

    @autobind
    logout() {
        this.props.dispatch(logout());
    }

    render() {
        const {session: {isLoggedIn}} = this.props;
        return (
            <div id="main">
                <Header onLogout={this.logout}/>
                <main className="site-content container">
                    {this.props.children}
                </main>
                <Toastr />
            </div>
        );
    }
}