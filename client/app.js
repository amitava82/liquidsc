import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import autobind from 'autobind-decorator';
import Helmet from 'react-helmet';
import {logout} from './redux/modules/session';
import Toastr from './utils/toastr';
import Header from './components/header';
import Footer from './components/footer';
import { events } from '../constants';
import {getSession} from './redux/modules/session';

import { createToast } from './redux/modules/toast';
import './scss/export.scss';

@connect(state => state)
export default class App extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            loading: true
        }
    }
    componentWillMount(){
        const {dispatch} = this.props;

        dispatch(getSession()).then(
            r => this.setState({loading: false})
        ).catch(
            e => {
                //dispatch(push('/login'));
                this.setState({loading: false});
            }
        )
    }

    @autobind
    logout() {
        this.props.dispatch(logout());
    }

    render() {
        const {loading} = this.state;
        const {session: {isLoggedIn}} = this.props;
        return (
            <div id="main">
                <Header onLogout={this.logout}/>
                <main className="site-content container">
                    {!loading && this.props.children}
                </main>
                <Toastr />
            </div>
        );
    }
}