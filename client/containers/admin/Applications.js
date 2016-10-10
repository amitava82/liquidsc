/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';


import { getApplications } from '../../redux/modules/applications';

@connect(state=>state)
export default class LoanAccounts extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            filter: 'PENDING'
        }
    }

    componentWillMount() {
        this.props.dispatch(getApplications({status: this.state.filter}));
    }

    @autobind
    filter(e) {
        const val = e.target.value;
        this.props.dispatch(getApplications({status: val}));
        this.setState({filter: val});
    }

    render() {
        const {applications: {data}} = this.props;

        const appRows = data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.buyerCompany}</td>
                <td><Link to={`/admin/applications/${i._id}`}>View</Link></td>
            </tr>
        ));

        return (
            <div>
                <h3>Applications</h3>
                <div className="pull-right">
                    <select className="form-control" onChange={this.filter} value={this.state.filter}>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                    </select>
                </div>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company</th>
                        <th>Loan amount</th>
                        <th>Buyer</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appRows}
                    </tbody>
                </table>
            </div>
        )
    }
}