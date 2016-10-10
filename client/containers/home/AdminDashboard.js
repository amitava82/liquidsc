/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Link } from 'react-router';

import { getUsers, approveUser } from '../../redux/modules/users';
import { getApplications } from '../../redux/modules/applications';

@connect(state=>state)
export default class AdminDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getUsers({approved: false}));
    }

    @autobind
    approve(id) {
        this.props.dispatch(approveUser(id));
    }

    render() {
        const {users: {data}} = this.props;
        const rows = data.map(i => (
            <tr key={i._id}>
                <td>{i.email}</td>
                <td>{i.role}</td>
                <td>{i.phone}</td>
                <td>{i.company}</td>
                <td><button onClick={e => this.approve(i._id)} className="btn btn-default btn-sm">Approve</button></td>
            </tr>
        ));


        return (
            <div>
                <h3>New Users registrations</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>company</th>
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