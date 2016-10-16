/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import { Row, Col, Button, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import UIDate from '../../components/UIDate';
import SearchBar, {buildQuery} from '../../components/Searchbar';

import UpdateAccount from './UpdateAccount';
import { loadAccounts, updateAccount } from '../../redux/modules/loanAccounts';

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
            showSearch : false
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
                <td>{i.lender.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.interestRate}</td>
                <td>{i.tenor} days</td>
                <td><UIDate date={i.disbursementDate} time={false} /></td>
                <td><UIDate date={i.repaymentDate} time={false}/></td>
                <td><button className="btn btn-primary" onClick={e => this.toggleEdit(i._id)}>Edit</button></td>
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
                <table className="table table-bordered table-striped table-condensed table-hover">
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
                {paginationContent}
                {this.state.editing && <UpdateAccount onHide={e => this.toggleEdit(null)} onSubmit={this.updateAccount} />}
            </div>
        )
    }
}