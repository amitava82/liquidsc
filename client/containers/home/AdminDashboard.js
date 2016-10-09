/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import { getUsers, approveUser } from '../../redux/modules/users';

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
                <th>{i.email}</th>
                <th>{i.role}</th>
                <th>{i.phone}</th>
                <th>{i.company}</th>
                <th><button onClick={e => this.approve(i._id)} className="btn btn-default btn-sm">Approve</button></th>
            </tr>
        ));
        return (
            <div>
                <h2>New Users registration</h2>
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