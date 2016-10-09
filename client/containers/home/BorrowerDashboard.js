
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
                <td></td>
            </tr>
        ));

        return (
            <h1>Borrower</h1>
        )
    }
}