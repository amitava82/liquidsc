/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import filter from 'lodash/filter';
import { Navbar, Nav, NavItem, Tabs, Tab, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UIDate from '../../components/UIDate';
import SearchBar from '../../components/Searchbar';

import { getUsers } from '../../redux/modules/users';

@connect(state => state)
export default class Users extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            showSearch : false
        }
    }

    componentWillMount() {
        this.props.dispatch(getUsers({approved: true}));
    }

    @autobind
    toggleSearch() {
        this.setState({showSearch: !this.state.showSearch});
    }

    render () {
        const {users: {data}} = this.props;

        const buyers = filter(data, {role: 'BUYER'});
        const borrowers = filter(data, {role: 'BORROWER'});
        const lenders = filter(data, {role: 'LENDER'});

        const style= {
            marginTop: 10
        };

        const buyerTable = (
            <table className="table table-bordered" style={style}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Company</th>
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
                {buyers.map(i => (
                    <tr key={i._id}>
                        <td>{i._id}</td>
                        <td>{i.email}</td>
                        <td>{i.company}</td>
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
            </table>
        );

        const borrowerTable = (
            <table className="table table-bordered" style={style}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Company</th>
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
                {borrowers.map(i => (
                    <tr key={i._id}>
                        <td>{i._id}</td>
                        <td>{i.email}</td>
                        <td>{i.company}</td>
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
            </table>
        );

        const lenderTable = (
            <table className="table table-bordered" style={style}>
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
                {lenders.map(i => (
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
            </table>
        );

        return (
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Buyers">
                        <div className="text-right">
                            <Button bsStyle="default" onClick={this.toggleSearch}>{this.state.showSearch ? 'Hide': 'Search'}</Button>
                        </div>
                        {this.state.showSearch ? (
                            <div className="well">
                                <SearchBar/>
                            </div>
                        ) : null}
                        {buyerTable}
                    </Tab>
                    <Tab eventKey={2} title="Borrowers">{borrowerTable}</Tab>
                    <Tab eventKey={3} title="Lenders">{lenderTable}</Tab>
                </Tabs>
            </div>
        )

    }
}