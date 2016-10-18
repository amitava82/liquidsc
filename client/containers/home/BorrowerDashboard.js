
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import UIDate from '../../components/UIDate';
import { getApplications } from '../../redux/modules/applications';
import { loadAccounts } from '../../redux/modules/loanAccounts';
import { Navbar, Nav, NavItem, Tabs, Tab, Pagination } from 'react-bootstrap';
import UploadDocModal  from './UploadDocModal';
import {pc} from '../../utils';

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

    @autobind
    gotoPage(page) {
        this.props.dispatch(getApplications({page: page}));
    }

    @autobind
    gotoPageLoanAccount(page) {
        this.props.dispatch(loadAccounts({page: page}));
    }


    render() {
        const {applications: {data, page, pages}, loanAccounts} = this.props;
        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt}/></td>
                <td>{i.loanAmount}</td>
                <td>{i.rateOfInterest}</td>
                <td className="capitalize">{i.receivableStatus}</td>
                <td className="capitalize">{i.status}</td>
                <td>{i.status !== 'APPROVED' && <button onClick={e => this.toggleUpload(i._id)}>Upload Doc</button>}</td>
            </tr>
        ));

        const accountRows = loanAccounts.data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt} time={false} /></td>
                <td>{i.loanAmount}</td>
                <td>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Company</th>
                            <th>Amount</th>
                            <th>Percent</th>
                            <th>Interest Rate</th>
                            <th>Tenor</th>
                            <th>Disbursement date</th>
                            <th>Repayment date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {i.lenders.map(l => (
                            <tr key={l._id}>
                                <td>{l.lender.company}</td>
                                <td>{l.loanAmount}</td>
                                <td>{pc(l.loanAmount, i.loanAmount)}%</td>
                                <td>{l.interestRate}</td>
                                <td>{l.tenor}</td>
                                <td><UIDate date={l.disbursementDate} time={false} /></td>
                                <td><UIDate date={l.repaymentDate} time={false}/></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        ));


        return (
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Applications">
                        <br/>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Application date</th>
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
                        <div>
                            <Pagination
                                prev
                                next
                                first
                                last
                                boundaryLinks
                                items={pages}
                                maxButtons={5}
                                activePage={Number(page)}
                                onSelect={this.gotoPage} />
                        </div>
                    </Tab>
                    <Tab eventKey={2} title="Loan Accounts">
                        <br/>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Created on</th>
                                <th>Amount</th>
                                <th>Lenders</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accountRows}
                            </tbody>
                        </table>
                        <div>
                            <Pagination
                                prev
                                next
                                first
                                last
                                boundaryLinks
                                items={loanAccounts.pages}
                                maxButtons={5}
                                activePage={Number(loanAccounts.page)}
                                onSelect={this.gotoPageLoanAccount} />
                        </div>
                    </Tab>
                </Tabs>
                {this.state.uploading && <UploadDocModal id={this.state.uploading} onHide={e => this.toggleUpload(null)} />}
            </div>
        )
    }
}