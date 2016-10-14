/**
 * Created by amita on 10/14/2016.
 */
import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import accounting from 'accounting';

import { loadAnalytics } from '../../redux/modules/analytics';

function calcPc(num, total) {
    return evenRound((num/total) * 100, 1);
}

function evenRound(num, decimalPlaces) {
    var d = decimalPlaces || 0;
    var m = Math.pow(10, d);
    var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
    var i = Math.floor(n), f = n - i;
    var e = 1e-8; // Allow for rounding errors in f
    var r = (f > 0.5 - e && f < 0.5 + e) ?
        ((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
}


@connect(state => state, { loadAnalytics })
export default class Analytics extends React.Component {

    componentWillMount() {
        this.props.loadAnalytics();
    }

    render() {
        const {analytics: {data}} = this.props;

        if(Object.keys(data).length === 0) return null;

        const pending = get(find(data.appStatus, {_id: 'PENDING'}), 'count', 0);
        const approved = data.totalLoanAcc;
        const rejected = get(find(data.appStatus, {_id: 'REJECTED'}), 'count', 0);

        return (
            <div>
                <Row>
                    <Col xs={3}>
                        <div className="card">
                            <h5>Registration</h5>
                            <div className="card-content">
                                <h4>New</h4>
                                <h2 className="text-success">{get(data, 'newUsersCount', 0)}</h2>
                                <h4>Pending</h4>
                                <h2 className="text-success">{get(data, 'pendingUsersCount', 0)}</h2>
                            </div>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className="card">
                            <h5>Users</h5>
                            <div className="card-content">
                                <h4>Buyer</h4>
                                <h2 className="text-success">{get(find(data.usersTypeCount, {_id: 'BUYER'}), 'count', 0)}</h2>
                                <h4>Seller</h4>
                                <h2 className="text-success">{get(find(data.usersTypeCount, {_id: 'BORROWER'}), 'count', 0)}</h2>
                                <h4>Lender</h4>
                                <h2 className="text-success">{get(find(data.usersTypeCount, {_id: 'LENDER'}), 'count', 0)}</h2>
                            </div>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className="card">
                            <h5>Applications</h5>
                            <div className="card-content">
                                <h4>Pending</h4>
                                <h2 className="text-success">{pending}</h2>
                                <h4>Approved</h4>
                                <h2 className="text-success">{approved}</h2>
                                <h4>Rejected</h4>
                                <h2 className="text-success">{rejected}</h2>
                            </div>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div className="card">
                            <h5>Applications %</h5>
                            <div className="card-content">
                                <h4>Pending</h4>
                                <h2 className="text-success">{calcPc(pending, data.totalAppCount)}%</h2>
                                <h4>Approved</h4>
                                <h2 className="text-success">{calcPc(approved, data.totalAppCount)}%</h2>
                                <h4>Rejected</h4>
                                <h2 className="text-success">{calcPc(rejected, data.totalAppCount)}%</h2>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <div className="card">
                            <h5>Loan Account</h5>
                            <div className="card-content">
                                <h4>Total</h4>
                                <h2 className="text-success">{data.totalLoanAcc}</h2>
                                <h4>Total Loan Funded</h4>
                                <h2 className="text-success">{accounting.formatMoney(data.totalLoanAmount)}</h2>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}