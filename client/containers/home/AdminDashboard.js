/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, Tabs, Tab } from 'react-bootstrap';
import filter from 'lodash/filter';
import { getUsers, approveUser } from '../../redux/modules/users';
import { getApplications } from '../../redux/modules/applications';
import UIDate from '../../components/UIDate';

@connect(state=>state)
export default class AdminDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getUsers({approved: false}));
    }

    @autobind
    approve(id) {
        this.props.dispatch(approveUser(id));
    }

    render() {
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
                    <th></th>
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
                        <td><button onClick={e => this.approve(i._id)} className="btn btn-default btn-sm">Approve</button></td>
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
                    <th>Nature of Business</th>
                    <th>Created</th>
                    <th></th>
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
                        <td><button onClick={e => this.approve(i._id)} className="btn btn-default btn-sm">Approve</button></td>
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
                    <th></th>
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
                        <td><button onClick={e => this.approve(i._id)} className="btn btn-default btn-sm">Approve</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        );

        return (
            <div>
                <h3>New Users registrations</h3>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="Buyers">{buyerTable}</Tab>
                    <Tab eventKey={2} title="Borrowers">{borrowerTable}</Tab>
                    <Tab eventKey={3} title="Lenders">{lenderTable}</Tab>
                </Tabs>
            </div>
        );
    }
}