/**
 * Created by amita on 10/14/2016.
 */
import React from 'react';
import find from 'lodash/find';
import moment from 'moment';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
import accounting from 'accounting';
import {PieChart, Pie, Legend, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Line } from 'react-chartjs-2';

import { loadAnalytics, loadApplications, loadBids } from '../../redux/modules/analytics';
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

const getTicks = (data) => {
    if (!data || !data.length ) {return [];}

    const domain = [new Date(data[0].date), new Date(data[data.length - 1].date)];
    const scale = d3_scale.scaleTime().domain(domain).range([0, 1]);
    const ticks = scale.ticks(d3_time.timeDay, 1);

    return ticks.map(entry => +entry);
};

const dateFormat = (time) => {
    return moment(time).format('MM/DD');
};



@connect(state => state, { loadAnalytics, loadApplications, loadBids  })
export default class Analytics extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            app: ''
        }
    }

    componentWillMount() {
        this.props.loadAnalytics();
        this.props.loadApplications().then(
            docs => {
                if(docs.length) {
                    this.props.loadBids(docs[0]);
                    this.setState({app: docs[0]});
                }
            }
        )
    }

    selectApp(id) {
        this.setState({app: id});
        this.props.loadBids(id);
    }

    render() {
        const {analytics: {data, applications, bids}} = this.props;


        var labels = [], dataPoints=[];
        bids.forEach(function(bid) {
            labels.push(moment(bid.date).format('DD-MM-YYYY'));
            dataPoints.push(bid.bids);
        });

        const lineData = {
            labels: labels,
            datasets: [
                {
                    label: 'Bids',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: dataPoints
                }
            ]
        };

        if(Object.keys(data).length === 0) return null;

        const pending = get(find(data.appStatus, {_id: 'PENDING'}), 'count', 0);
        const approved = data.totalLoanAcc;
        const rejected = get(find(data.appStatus, {_id: 'REJECTED'}), 'count', 0);
        const reviewing = get(find(data.appStatus, {_id: 'UNDER_REVIEW'}), 'count', 0);

        const applicationChartData = [
            {name: 'Pending', value: calcPc(pending, data.totalAppCount)},
            {name: 'Under review', value: calcPc(reviewing, data.totalAppCount)},
            {name: 'Approved', value: calcPc(approved, data.totalAppCount)},
            {name: 'Rejected', value: calcPc(rejected, data.totalAppCount)},
        ];

        return (
            <div style={{marginTop: 20}}>
                <Row>
                    <Col xs={12}>
                        <div className="form-group">
                            <div className="control-label">Select loan application</div>
                            <select onChange={e => this.selectApp(e.target.value)} className="form-control" value={this.state.app}>
                                {applications.map(i => (<option value={i._id} key={i._id}>{i._id}</option>))}
                            </select>
                        </div>
                        <div>
                            <Line
                                data={lineData}
                                height={300}
                                options={{
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    </Col>
                </Row>
                <br/>
                <Row>
                    <Col xs={6}>
                        <Table>
                            <tbody>
                                <tr>
                                    <th>Users</th>
                                    <th>Count</th>
                                </tr>
                                <tr>
                                    <td>New Registration</td>
                                    <td>{get(data, 'newUsersCount', 0)}</td>
                                </tr>
                                <tr>
                                    <td>Registration Req Pending</td>
                                    <td>{get(data, 'pendingUsersCount', 0)}</td>
                                </tr>
                                <tr>
                                    <td>Total Buyers</td>
                                    <td>{get(find(data.usersTypeCount, {_id: 'BUYER'}), 'count', 0)}</td>
                                </tr>
                                <tr>
                                    <td>Total Sellers</td>
                                    <td>{get(find(data.usersTypeCount, {_id: 'BORROWER'}), 'count', 0)}</td>
                                </tr>
                                <tr>
                                    <td>Total Lenders</td>
                                    <td>{get(find(data.usersTypeCount, {_id: 'LENDER'}), 'count', 0)}</td>
                                </tr>
                                <tr>
                                    <th>Applications</th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>Pending</td>
                                    <td>{pending}</td>
                                </tr>
                                <tr>
                                    <td>Under Review</td>
                                    <td>{reviewing}</td>
                                </tr>
                                <tr>
                                    <td>ALCH Approved</td>
                                    <td>{approved}</td>
                                </tr>
                                <tr>
                                    <td>Received Bid(s)</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Not Received Bid</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Total App till date</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>Loan</th>
                                    <th></th>
                                </tr>
                                <tr>
                                    <td>Total Loan Accounts</td>
                                    <td>{data.totalLoanAcc}</td>
                                </tr>
                                <tr>
                                    <td>Total Loan Amount Funded</td>
                                    <td>{accounting.formatMoney(data.totalLoanAmount)}</td>
                                </tr>
                                <tr>
                                    <td>Total Amount Not Funded</td>
                                    <td></td>
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