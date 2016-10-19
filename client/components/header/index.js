import React from 'react';
import autobind from 'autobind-decorator';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { showNav } from '../../redux/modules/session';

@connect(state => state)
export default class Header extends React.Component {

    @autobind
    onToggle() {
        this.props.dispatch(showNav());
    }

    renderMenus() {
        const {session: {user}} = this.props;
        const items = [];
        if(user) {
            if(user.role == 'BORROWER') {
                items.push(
                    <LinkContainer to="/application/create" key={1}>
                        <NavItem>New Loan</NavItem>
                    </LinkContainer>
                );
                items.push(
                    <LinkContainer to="/analytics" key={6}>
                        <NavItem>Analytics</NavItem>
                    </LinkContainer>
                );
            } else if(user.role == 'ADMIN') {
                items.push(
                    <LinkContainer to="/admin/users" key={2}>
                        <NavItem>Users</NavItem>
                    </LinkContainer>
                );
                items.push(
                    <LinkContainer to="/admin/applications" key={3}>
                        <NavItem>Applications</NavItem>
                    </LinkContainer>
                );
                items.push(
                    <LinkContainer to="/admin/accounts" key={4}>
                        <NavItem>Accounts</NavItem>
                    </LinkContainer>
                );
                items.push(
                    <LinkContainer to="/admin/analytics" key={5}>
                        <NavItem>Analytics</NavItem>
                    </LinkContainer>
                );
            } else if(user.role == 'LENDER') {
                items.push(
                    <LinkContainer to="/analytics" key={6}>
                        <NavItem>Analytics</NavItem>
                    </LinkContainer>
                );
            }
        }
        return items;
    }

    render () {
        const {session} = this.props;

        return (
            <div className="header">
                <Navbar expanded={session.showNav} onToggle={this.onToggle}  fixedTop inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">LiquidSC</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <LinkContainer to="/home">
                                <NavItem>Home</NavItem>
                            </LinkContainer>
                            {this.renderMenus()}
                        </Nav>
                        <Nav pullRight>
                            {session.isLoggedIn ? (
                                <NavDropdown title={session.user.name || session.user.company || session.user.email}>
                                    <MenuItem href="/api/auth/logout?redirect=/">Log out</MenuItem>
                                </NavDropdown>
                            ): (
                                <LinkContainer to="/login">
                                    <NavItem>Login</NavItem>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}