/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import UIDate from '../../components/UIDate';

import UpdateAccount from './UpdateAccount';
import { loadAccounts, updateAccount } from '../../redux/modules/loanAccounts';

@connect(state=>state)
export default class LoanAccounts extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            editing: null
        }
    }

    @autobind
    toggleEdit(id) {
        this.setState({editing: id});
    }

    @autobind
    updateAccount(date) {
        this.props.dispatch(updateAccount(this.state.editing, date)).then(
            () => this.setState({editing: null})
        );
    }

    componentWillMount() {
        this.props.dispatch(loadAccounts());
    }

    render() {
        const {loanAccounts: {data}} = this.props;

        const rows = data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td>{i.borrower.company}</td>
                <td>{i.lender.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.interestRate}</td>
                <td>{i.tenor} days</td>
                <td><UIDate date={i.disbursementDate}/></td>
                <td><UIDate date={i.repaymentDate}/></td>
                <td><button className="btn btn-primary" onClick={e => this.toggleEdit(i._id)}>Edit</button></td>
            </tr>
        ));

        return (
            <div>
                <h3>Loan Accounts</h3>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Borrower</th>
                            <th>Lender</th>
                            <th>Amount</th>
                            <th>Interest %</th>
                            <th>Tenor</th>
                            <th>Disbursement date</th>
                            <th>Repayment date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                {this.state.editing && <UpdateAccount onHide={e => this.toggleEdit(null)} onSubmit={this.updateAccount} />}
            </div>
        )
    }
}