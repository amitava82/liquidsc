/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Row, Col, Button, Table, Pagination } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import UIDate from '../../components/UIDate';
import SearchBar, {buildQuery} from '../../components/Searchbar';

import { getApplications } from '../../redux/modules/applications';

const FILTERS = [
    {label: 'ID', value: '_id'},
    {label: 'Company name', value: 'company.company'},
    {label: 'Buyer Decision', value: 'receivableStatus', options: ['approved', 'pending', 'rejected']},
    {label: 'Lender decision', value: 'account', options: ['approved', 'pending']},
    {label: 'ALCH decision', value: 'status',  options: ['APPROVED', 'PENDING', 'REJECTED']}
];

@connect(state=>state)
export default class LoanAccounts extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            showSearch : false
        }
    }

    componentWillMount() {
        this.props.dispatch(getApplications({}));
    }

    @autobind
    toggleSearch() {
        this.setState({showSearch: !this.state.showSearch});
    }

    @autobind
    doSearch(query) {
        const q = buildQuery(query);
        this.props.dispatch(getApplications(q));
    }

    @autobind
    gotoPage(page) {
        this.props.dispatch(getApplications({...this.props.users.query, page: page}));
    }

    render() {
        const {applications: {data, page, pages}} = this.props;

        const appRows = data.map(i => (
            <tr key={i._id}>
                <td>{i._id}</td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td>{i.buyerCompany}</td>
                <td className="capitalize">{i.receivableStatus}</td>
                <td className="capitalize">{i.proposals.length ?  + i.proposals.length + ' Bid(s)' : 'No Bid'}</td>
                <th>{i.status}</th>
                <td><Link to={`/admin/applications/${i._id}`}>View</Link></td>
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
                <h3>Loan Opportunities and Bid Status</h3>
                <div style={{marginBottom: 10}}>
                    {searchContent}
                </div>
                <Table striped  hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company</th>
                        <th>Loan amount</th>
                        <th>Buyer</th>
                        <th>Buyer Validation</th>
                        <th>Bid Received</th>
                        <th>ALCH Decision</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appRows}
                    </tbody>
                </Table>
                {paginationContent}
            </div>
        )
    }
}