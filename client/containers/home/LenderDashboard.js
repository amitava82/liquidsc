/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import {Link} from 'react-router';
import {Table, Tabs, Tab, Pagination} from 'react-bootstrap';
import UIDate from '../../components/UIDate';
import {getApplications} from '../../redux/modules/applications';
import {loadAccounts} from '../../redux/modules/loanAccounts';
import { calcInterest } from '../../utils';

import LenderOverview from './LenderOverview';

@connect(state=>state)
export default class LenderDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplications());
        this.props.dispatch(loadAccounts());
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
        const {applications: {data, page, pages }, loanAccounts} = this.props;

        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt}/></td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.bidAccepted ? 'Bid accepted' : i.proposals ? 'Bid placed' : 'No Bid'}</td>
                <td>{moment(i.lenders[0].createdAt).add(30, 'd').diff(moment(), 'd')}</td>
                <td>
                    <Link className="btn btn-primary" to={`/lender/applications/${i._id}`}>View</Link>
                </td>
            </tr>
        ));

        const accountRows = loanAccounts.data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt} time={false} /></td>
                <td>{i.borrower.company}</td>
                <td>{i.lenders[0].loanAmount}</td>
                <td>{i.lenders[0].interestRate}</td>
                <td>{calcInterest(i.lenders[0].loanAmount, i.lenders[0].interestRate, i.lenders[0].tenor)}</td>
                <td>{i.lenders[0].tenor}</td>
                <td><UIDate date={i.lenders[0].disbursementDate} time={false}/></td>
                <td><UIDate date={i.lenders[0].repaymentDate} time={false}/></td>
                <td>{i.lenders[0].settled ? 'Yes' : 'No'}</td>
            </tr>
        ));

        return (
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Overview">
                        <LenderOverview />
                    </Tab>
                    <Tab eventKey={2} title="Loan Opportunities & Bid Status">
                        <br/>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Application date</th>
                                <th>Company</th>
                                <th>Amount</th>
                                <th>Bid</th>
                                <th>Days to bid</th>
                                <th>Action</th>
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
                    <Tab eventKey={3} title="Loans Portfolio">
                        <br/>
                        <Table striped responsive>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Created on</th>
                                <th>Borrower</th>
                                <th>Amount</th>
                                <th>Interest %</th>
                                <th>Interest</th>
                                <th>Tenor</th>
                                <th>Disbursement Date</th>
                                <th>Repayment Date</th>
                                <th>Settled</th>
                            </tr>
                            </thead>
                            <tbody>
                            {accountRows}
                            </tbody>
                        </Table>
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
            </ div >
        )
    }
}