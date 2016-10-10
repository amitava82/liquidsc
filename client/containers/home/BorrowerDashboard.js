
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { getApplications } from '../../redux/modules/applications';

@connect(state=>state)
export default class SupplierDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplications());
    }

    render() {
        const {applications: {data}} = this.props;
        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td>{new Date(i.createdAt).toDateString()}</td>
                <td>{i.loanAmount}</td>
                <td>{i.status}</td>
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
                            <th>Amount</th>
                            <th>Status</th>
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