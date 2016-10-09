
/**
 * Created by amitava on 19/08/16.
 */
import React from 'react';
import {Router, applyRouterMiddleware} from 'react-router';
import useScroll from 'react-router-scroll';
import {Provider} from 'react-redux';


export default class Client extends React.Component {
    render() {
        const {store, history, routes} = this.props;


        return (
            <Provider store={store}>
                <Router history={history} render={applyRouterMiddleware(useScroll())}>
                    {routes}
                </Router>
            </Provider>
        )
    }
}