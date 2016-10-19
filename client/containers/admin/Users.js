/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import filter from 'lodash/filter';
import each from 'lodash/forEach';
import { Navbar, Nav, NavItem, Tabs, Tab, Button, Pagination, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UIDate from '../../components/UIDate';
import SearchBar, {buildQuery} from '../../components/Searchbar';

import { getUsers } from '../../redux/modules/users';

@connect(state => state)
export default class Users extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            key: 'BUYER',
            showSearch : false
        }
    }

    componentWillMount() {
        this.props.dispatch(getUsers({approved: true, role: this.state.key}));
    }

    @autobind
    toggleSearch() {
        this.setState({showSearch: !this.state.showSearch});
    }

    @autobind
    doSearch(query) {
        const q = buildQuery(query);
        this.props.dispatch(getUsers({approved: true, ...q, role: this.state.key}));
    }

    @autobind
    gotoPage(page) {
        this.props.dispatch(getUsers({...this.props.users.query, page: page}));
    }

    @autobind
    handleSelect(key) {
        this.setState({key});
        this.props.dispatch(getUsers({role: key, page: 1, approved: true}));
    }

    render () {
        const {users: {data, page, pages}} = this.props;

        const style= {
            marginTop: 10
        };

        const buyerTable = (
            <Table striped  hover style={style} responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Sector</th>
                        <th>Sub-sector</th>
                        <th>PAN</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Contact person</th>
                        <th>Designation</th>
                        <th>Nature of Business</th>
                        <th>Created</th>
                        <th>Approved</th>
                    </tr>
                </thead>
                <tbody>
                {data.map(i => (
                    <tr key={i._id}>
                        <td>{i._id}</td>
                        <td>{i.name}</td>
                        <td>{i.email}</td>
                        <td>{i.company}</td>
                        <td>{i.sector}</td>
                        <td>{i.subSector}</td>
                        <td>{i.pan}</td>
                        <td>{i.phoneCode}-{i.phone}</td>
                        <td>{i.address}</td>
                        <td>{i.city}</td>
                        <td>{i.country}</td>
                        <td>{i.contactPerson}</td>
                        <td>{i.designation}</td>
                        <td>{i.businessType}</td>
                        <td><UIDate date={i.createdAt}/></td>
                        <td><UIDate date={i.approvedAt}/></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        );

        const borrowerTable = (
            <Table striped  hover style={style} responsive>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Sub-sector</th>
                    <th>PAN</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Contact person</th>
                    <th>Designation</th>
                    <th>Business type</th>
                    <th>Created</th>
                    <th>Approved</th>
                </tr>
                </thead>
                <tbody>
                {data.map(i => (
                    <tr key={i._id}>
                        <td>{i._id}</td>
                        <td>{i.name}</td>
                        <td>{i.email}</td>
                        <td>{i.company}</td>
                        <td>{i.sector}</td>
                        <td>{i.subSector}</td>
                        <td>{i.pan}</td>
                        <td>{i.phoneCode}-{i.phone}</td>
                        <td>{i.address}</td>
                        <td>{i.city}</td>
                        <td>{i.country}</td>
                        <td>{i.contactPerson}</td>
                        <td>{i.designation}</td>
                        <td>{i.businessType}</td>
                        <td><UIDate date={i.createdAt}/></td>
                        <td><UIDate date={i.approvedAt}/></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        );

        const lenderTable = (
            <Table striped  hover style={style} responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Full name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Lender type</th>
                        <th>Designation</th>
                        <th>Created</th>
                        <th>Approved</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(i => (
                        <tr key={i._id}>
                            <td>{i._id}</td>
                            <td>{i.email}</td>
                            <td>{i.company}</td>
                            <td>{i.fullName}</td>
                            <td>{i.phoneCode}-{i.phone}</td>
                            <td>{i.address}</td>
                            <td>{i.city}</td>
                            <td>{i.country}</td>
                            <td>{i.lenderType}</td>
                            <td>{i.designation}</td>
                            <td><UIDate date={i.createdAt}/></td>
                            <td><UIDate date={i.approvedAt}/></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );

        const searchContent = (
            <div>
                <div className="text-right">
                    <Button bsStyle="default" onClick={this.toggleSearch}>{this.state.showSearch ? 'Hide': 'Search'}</Button>
                </div>
                {
                    this.state.showSearch ? (
                        <div className="well">
                            <SearchBar onSearch={this.doSearch} />
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
                {searchContent}
                <Tabs defaultActiveKey={1} animation={false} activeKey={this.state.key} onSelect={this.handleSelect}>
                    <Tab eventKey="BUYER" title="Buyers">
                        {buyerTable}
                    </Tab>
                    <Tab eventKey="BORROWER" title="Borrowers">
                        {borrowerTable}
                        </Tab>
                    <Tab eventKey="LENDER" title="Lenders">
                        {lenderTable}
                    </Tab>
                </Tabs>
                <br/>
                {paginationContent}
            </div>
        )

    }
}