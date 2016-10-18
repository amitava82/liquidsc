/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import accounting from 'accounting';
import UIDate from '../../components/UIDate';

import { getAccount } from '../../redux/modules/loanAccounts';

const pc = (amt, total) => accounting.toFixed((amt * 100)/total);

@connect(state => state)
export default class LoanAccountDetails extends React.Component {


    componentWillMount() {
        this.props.dispatch(getAccount(this.props.params.account));
    }

    render() {
        const {loanAccounts: {viewing}} = this.props;

        if(!viewing) return null;

        return (
            <div>
                <h1>Account details</h1>
                <dl className="dl-horizontal">
                    <dt>ID</dt>
                    <dd>{viewing._id}</dd>
                    <dt>Created</dt>
                    <dd><UIDate date={viewing.createdAt} time={false} /></dd>
                    <dt>Borrower</dt>
                    <dd>{viewing.borrower.company}</dd>
                    <dt>Loan amount</dt>
                    <dd>{viewing.loanAmount}</dd>
                </dl>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Company</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                        <th>Rate %</th>
                        <th>Tenor</th>
                        <th>Disbursement date</th>
                        <th>Repayment date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {viewing.lenders.map(l => (
                        <tr key={l._id}>
                            <td>{l.lender.company}</td>
                            <td>{l.loanAmount}</td>
                            <td>{pc(l.loanAmount, viewing.loanAmount)}%</td>
                            <td>{l.interestRate}</td>
                            <td>{l.tenor} days</td>
                            <td><UIDate date={l.disbursementDate} time={false} /></td>
                            <td><UIDate date={l.repaymentDate} time={false}/></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}