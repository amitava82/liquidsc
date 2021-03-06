/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import cx from 'classnames';
import autobind from 'autobind-decorator';
import accounting from 'accounting';
import { Row, Col, Button, Table, Pagination, Label, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import UIDate from '../../components/UIDate';
import SearchBar, {buildQuery} from '../../components/Searchbar';
import { calcInterest } from '../../utils';

import UpdateAccount from './UpdateAccount';
import { loadAccounts, updateAccount, settleAccount, changeFees } from '../../redux/modules/loanAccounts';

const pc = (amt, total) => accounting.toFixed((amt * 100)/total);

const FILTERS = [
    {label: 'ID', value: '_id'},
    {label: 'Borrower', value: 'borrower.company'},
    {label: 'Lender', value: 'lenders.lender.company'},
    {label: 'Amount', value: 'loanAmount'},
    {label: 'Tenor', value: 'lenders.tenor'},
    {label: 'Disbursement', value: 'lenders.disbursementDate', type: 'date'},
    {label: 'Repayment', value: 'lenders.repaymentDate', type: 'date'}
];

@connect(state=>state)
export default class LoanAccounts extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            editing: null,
            docId: null,
            showSearch : false,
            visibleRow: ''
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

    @autobind
    settle(id, loan, value) {
        this.props.dispatch(settleAccount(id, loan, value == 'y'));
    }

    toggleDetails(id) {
        this.setState({visibleRow: this.state.visibleRow == id ? '' : id});
    }

    editFees(id) {
        const f = prompt('Please enter processing fees %', 1.25);
        if(f) {
            this.props.dispatch(changeFees(id, f));
        }
    }

    render() {
        const {loanAccounts: {data, page, pages}} = this.props;

        const allRows = [];

        data.forEach(i => {
            const fees = i.feesRate || 1.25;
            allRows.push(
                <tr key={i._id}>
                    <td>{i._id}</td>
                    <td>{i.borrower.company}</td>
                    <td>{i.loanAmount}</td>
                    <td>{fees}  <Glyphicon  glyph="pencil" onClick={e => this.editFees(i._id)} /></td>
                    <td>{(i.loanAmount * (fees/100)).toFixed(0)}</td>
                    <td>
                        <Button bsStyle="primary" bsSize="xs" onClick={e => this.toggleDetails(i._id)}>
                            <Glyphicon glyph="eye-open" />
                        </Button>
                    </td>
                </tr>
            );

            allRows.push(
                <tr key={i._id+1} id={i._id} className={cx({hidden: this.state.visibleRow != i._id})}>
                    <td colSpan="5">
                        <div className="collapsible-table">
                            <table className="table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <th>Lender</th>
                                    <th>Lender ID</th>
                                    <th>Amount</th>
                                    <th>Allocation %</th>
                                    <th>Interest %</th>
                                    <th>Interest</th>
                                    <th>Tenor</th>
                                    <th>Disbursement date</th>
                                    <th>Repayment date</th>
                                    <th>Account Overdue</th>
                                    <th>Settled</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {i.lenders.map(l => (
                                    <tr key={l._id}>
                                        <td>{l.lender.company}</td>
                                        <td>{l.lender._id}</td>
                                        <td>{l.loanAmount}</td>
                                        <td>{pc(l.loanAmount, i.loanAmount)}%</td>
                                        <td>{l.interestRate}</td>
                                        <td>{calcInterest(l.loanAmount, l.interestRate, l.tenor)}</td>
                                        <td>{l.tenor}</td>
                                        <td><UIDate date={l.disbursementDate} time={false} /></td>
                                        <td><UIDate date={l.repaymentDate} time={false}/></td>
                                        <td>
                                            {l.settled ? 'No' : moment(l.repaymentDate).isBefore(moment()) ?
                                                <Label bsStyle="danger">Yes - {moment().diff(moment(l.repaymentDate), 'd')} days</Label> : 'No'}
                                        </td>
                                        <td>
                                            <select
                                                style={{width: 100}}
                                                className="form-control"
                                                value={l.settled ? 'y' : 'n'}
                                                onChange={e => this.settle(i._id, l._id, e.target.value)}>
                                                <option value="n">No</option>
                                                <option value="y">Yes</option>
                                            </select>
                                        </td>
                                        <td><Button bsStyle="default" className="btn-sm" onClick={e => this.toggleEdit(i._id, l._id)}>Edit</Button></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )
        });

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
                <h3>Loan Portfolio</h3>
                <div style={{marginBottom: 10}}>
                    {searchContent}
                </div>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Borrower</th>
                            <th>Loan Amount</th>
                            <th>Processing Fees %</th>
                            <th>Processing fees</th>
                            <th>Lenders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRows}
                    </tbody>
                </Table>
                {paginationContent}
                {this.state.editing && <UpdateAccount onHide={e => this.toggleEdit(null)} onSubmit={this.updateAccount} />}
            </div>
        )
    }
}
