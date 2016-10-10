/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Link } from 'react-router';

import { submitProposal, getApplications } from '../../redux/modules/applications';

@connect(state=>state)
export default class LenderDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplications());
    }

    reject(id) {

    }

    render() {
        const {applications: {data}} = this.props;

        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td>{new Date(i.createdAt).toDateString()}</td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td>
                    <button onClick={e => this.reject(i._id)} className="btn btn-danger">Reject</button>
                    { ' '}
                    <Link className="btn btn-primary" to={`/lender/applications/${i._id}`}>Accept</Link>
                </td>
            </tr>
        ));

        return (
            <div>
                <h3>Applications</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Company</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        )
    }
}