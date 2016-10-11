/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';
import {Navbar, Nav, NavItem, Tabs, Tab} from 'react-bootstrap';
import UIDate from '../../components/UIDate';
import {getApplications} from '../../redux/modules/applications';
import {loadAccounts} from '../../redux/modules/loanAccounts';

@connect(state=>state)
export default class LenderDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplications());
        this.props.dispatch(loadAccounts());
    }

    reject(id) {

    }

    render() {
        const {applications: {data}, loanAccounts} = this.props;

        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td>{new Date(i.createdAt).toDateString()}</td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td>
                    <Link className="btn btn-primary" to={`/lender/applications/${i._id}`}>View</Link>
                </td>
            </tr>
        ));

        const accountRows = loanAccounts.data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt}/></td>
                <td>{i.borrower.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.interestRate}</td>
                <td>{i.tenor}</td>
                <td><UIDate date={i.disbursementDate}/></td>
                <td><UIDate date={i.repaymentDate}/></td>
            </tr>
        ));

        return (
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Applications">
                        <br/>
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
                    </Tab>
                    <Tab eventKey={2} title="Loan Accounts">
                        <br/>
                        <table className="table table-striped table-bordered">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Borrower</th>
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
                    </Tab>
                </Tabs>
            </ div >
        )
    }
}