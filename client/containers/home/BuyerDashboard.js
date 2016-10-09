/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';


@connect(state=>state)
export default class BuyerDashboard extends React.Component {
    render() {
        return (
            <h1>Buyer</h1>
        )
    }
}