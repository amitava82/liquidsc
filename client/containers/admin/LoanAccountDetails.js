/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import UIDate from '../../components/UIDate';

import { getAccount } from '../../redux/modules/loanAccounts';

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
                    <dd>{new Date(viewing.createdAt).toDateString()}</dd>
                    <dt>Borrower</dt>
                    <dd>{viewing.borrower.company}</dd>
                    <dt>Lender</dt>
                    <dd>{viewing.lender.company}</dd>
                    <dt> Amount</dt>
                    <dd>{viewing.loanAmount}</dd>
                    <dt>Tenor</dt>
                    <dd>{viewing.tenor} days</dd>
                    <dt>Disbursement Date</dt>
                    <dd><UIDate date={viewing.disbursementDate} /></dd>
                    <dt>Repayment Date</dt>
                    <dd><UIDate date={viewing.repaymentDate} /></dd>
                </dl>
            </div>
        )
    }
}