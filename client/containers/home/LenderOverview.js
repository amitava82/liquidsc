/**
 * Created by amita on 10/14/2016.
 */
import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
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
export default class LenderOverview extends React.Component {

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
            <div style={{marginTop: 20}}>
                <Row>
                    <Col xs={3}>
                        <div className="text-center">
                            <h4>Total Loan Funded</h4>
                            <h5 className="text-success">{accounting.formatMoney(data.totalLoanAmount, null, 0)}</h5>
                        </div>
                    </Col>
                    <Col xs={3}>
                        <div>
                            <Table>
                                <tbody>
                                    <tr>
                                        <td>Bids open</td>
                                        <td>{pending}</td>
                                    </tr>
                                    <tr>
                                        <td>Bids accepted</td>
                                        <td>{approved}</td>
                                    </tr>
                                    <tr>
                                        <td>Loans funded</td>
                                        <td>{approved}</td>
                                    </tr>
                                    <tr>
                                        <td>Loans O/S</td>
                                        <td>{pending}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}