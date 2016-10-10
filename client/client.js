
/**
 * Created by amitava on 19/08/16.
 */
import React from 'react';
import {Router, applyRouterMiddleware} from 'react-router';
import {connect} from 'react-redux';
import useScroll from 'react-router-scroll';
import {Provider} from 'react-redux';

import {getSession} from './redux/modules/session';

@connect(state => state)
export default class Client extends React.Component {

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

    render() {
        const {store, history, routes} = this.props;
        const {loading} = this.state;

        return (
            <Provider store={store}>
                {loading ? (
                    <h5>Loading...</h5>
                ) : (
                    <Router history={history} render={applyRouterMiddleware(useScroll())}>
                        { routes}
                    </Router>
                )}
            </Provider>
        )
    }
}