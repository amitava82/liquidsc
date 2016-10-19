/**
 * Created by amita on 10/14/2016.
 */
import React from 'react';
import find from 'lodash/find';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
import accounting from 'accounting';
import {PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { loadAnalytics } from '../../redux/modules/analytics';
const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

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

        const applicationChartData = [
            {name: 'Pending', value: calcPc(pending, data.totalAppCount)},
            {name: 'Approved', value: calcPc(approved, data.totalAppCount)},
            {name: 'Rejected', value: calcPc(rejected, data.totalAppCount)},
        ];

        return (
            <div style={{marginTop: 20}}>
                <div className="flex center">
                    <h3 className="flex-item">{data.totalLoanAcc} Loan accounts</h3>
                    <h3 className="strong">{accounting.formatMoney(data.totalLoanAmount)} Loan funded</h3>
                </div>
                <hr/>
                <Row>
                    <Col xs={6}>
                        <Table>
                            <caption>Registration</caption>
                            <thead>
                                <tr>
                                    <th>New</th>
                                    <th>Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{get(data, 'newUsersCount', 0)}</td>
                                    <td>{get(data, 'pendingUsersCount', 0)}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table>
                            <caption>Users</caption>
                            <thead>
                            <tr>
                                <th>Buyer</th>
                                <th>Seller</th>
                                <th>Lender</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{get(find(data.usersTypeCount, {_id: 'BUYER'}), 'count', 0)}</td>
                                <td>{get(find(data.usersTypeCount, {_id: 'BORROWER'}), 'count', 0)}</td>
                                <td>{get(find(data.usersTypeCount, {_id: 'LENDER'}), 'count', 0)}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table>
                            <caption>Applications</caption>
                            <thead>
                            <tr>
                                <th>Pending</th>
                                <th>Approved</th>
                                <th>Rejected</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{pending}</td>
                                <td>{approved}</td>
                                <td>{rejected}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={6}>
                        <div className="card">
                            <h5>Applications %</h5>
                            <div className="card-content">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie label labelLine={true} isAnimationActive={true} data={applicationChartData} cx="50%" cy="50%" outerRadius={80}>
                                            {applicationChartData.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)}
                                        </Pie>
                                        <Tooltip/>
                                        <Legend/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}