/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import accounting from 'accounting';
import { Row, Col, Button, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import UIDate from '../../components/UIDate';
import SearchBar, {buildQuery} from '../../components/Searchbar';

import UpdateAccount from './UpdateAccount';
import { loadAccounts, updateAccount } from '../../redux/modules/loanAccounts';

const pc = (amt, total) => accounting.toFixed((amt * 100)/total);

const FILTERS = [
    {label: 'ID', value: '_id'},
    {label: 'Borrower', value: 'borrower.company'},
    {label: 'Lender', value: 'lender.company'},
    {label: 'Amount', value: 'loanAmount'},
    {label: 'Tenor', value: 'tenor'}
];

@connect(state=>state)
export default class LoanAccounts extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            editing: null,
            docId: null,
            showSearch : false
        }
    }

    @autobind
    toggleEdit(accId, docId) {
        this.setState({editing: accId, docId});
    }

    @autobind
    updateAccount(date) {
        this.props.dispatch(updateAccount(this.state.editing, this.state.docId, date)).then(
            () => this.setState({editing: null})
        );
    }

    componentWillMount() {
        this.props.dispatch(loadAccounts());
    }

    @autobind
    toggleSearch() {
        this.setState({showSearch: !this.state.showSearch});
    }

    @autobind
    doSearch(query) {
        const q = buildQuery(query);
        this.props.dispatch(loadAccounts(q));
    }

    @autobind
    gotoPage(page) {
        this.props.dispatch(loadAccounts({...this.props.users.query, page: page}));
    }

    render() {
        const {loanAccounts: {data, page, pages}} = this.props;

        const rows = data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td>{i.borrower.company}</td>
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
                                <th></th>
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
                                    <td><button className="btn btn-primary btn-sm" onClick={e => this.toggleEdit(i._id, l._id)}>Edit</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        ));

        const searchContent = (
            <div>
                <div className="text-right">
                    <Button bsStyle="default" onClick={this.toggleSearch}>{this.state.showSearch ? 'Hide': 'Search'}</Button>
                </div>
                {
                    this.state.showSearch ? (
                        <div className="well">
                            <SearchBar onSearch={this.doSearch} filters={FILTERS} />
                        </div>
                    ) : null
                }
            </div>
        );

        const paginationContent = (
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
        );

        return (
            <div>
                <h3>Loan Accounts</h3>
                <div style={{marginBottom: 10}}>
                    {searchContent}
                </div>
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Borrower</th>
                            <th>Loan Amount</th>
                            <th>Lenders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                {paginationContent}
                {this.state.editing && <UpdateAccount onHide={e => this.toggleEdit(null)} onSubmit={this.updateAccount} />}
            </div>
        )
    }
}