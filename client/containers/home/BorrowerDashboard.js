
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import UIDate from '../../components/UIDate';
import { getApplications } from '../../redux/modules/applications';
import { loadAccounts } from '../../redux/modules/loanAccounts';

import UploadDocModal  from './UploadDocModal';

@connect(state=>state)
export default class SupplierDashboard extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            uploading: null
        }
    }
    componentWillMount() {
        this.props.dispatch(getApplications());
        this.props.dispatch(loadAccounts());
    }

    @autobind
    toggleUpload(id) {
        this.setState({uploading: id});
    }

    render() {
        const {applications: {data}, loanAccounts} = this.props;
        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt}/></td>
                <td>{i.loanAmount}</td>
                <td>{i.rateOfInterest}</td>
                <td>{i.receivableStatus}</td>
                <td>{i.status}</td>
                <td>{i.status !== 'APPROVED' && <button onClick={e => this.toggleUpload(i._id)}>Upload Doc</button>}</td>
            </tr>
        ));

        const accountRows = loanAccounts.data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt}/></td>
                <td>{i.lender.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.interestRate}</td>
                <td>{i.tenor}</td>
                <td><UIDate date={i.disbursementDate}/></td>
                <td><UIDate date={i.repaymentDate}/></td>
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
                            <th>Rate</th>
                            <th>Rec Doc status</th>
                            <th>Application Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <h3>Loan accounts</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Lender</th>
                            <th>Amount</th>
                            <th>Tenor</th>
                            <th>Rate</th>
                            <th>Disbursement Date</th>
                            <th>Repayment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accountRows}
                    </tbody>
                </table>
                {this.state.uploading && <UploadDocModal id={this.state.uploading} onHide={e => this.toggleUpload(null)} />}
            </div>
        )
    }
}