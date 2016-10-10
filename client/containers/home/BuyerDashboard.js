/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { getApplications, buyerChangeStatus } from '../../redux/modules/applications';

@connect(state=>state)
export default class BuyerDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplications());
    }

    changeStatus(id, status) {
        this.props.dispatch(buyerChangeStatus(id, status));
    }

    render() {
        const {applications: {data}} = this.props;
        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td>{new Date(i.createdAt).toDateString()}</td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td><a href={`/api/applications/${i._id}/docs/receivable`}>View</a></td>
                <td>{i.receivableStatus}</td>
                <td>{i.receivableStatus == 'pending' ? (
                    <div>
                        <button onClick={e => this.changeStatus(i._id, 'rejected')} className="btn btn-danger">Reject</button>
                        {' '}
                        <button onClick={e => this.changeStatus(i._id, 'approved')} className="btn btn-primary">Approve</button>
                    </div>
                ) : null}</td>
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
                        <th>Doc</th>
                        <th>Status</th>
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