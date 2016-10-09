import React from 'react';
import autobind from 'autobind-decorator';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { showNav } from '../../redux/modules/session';

@connect(state => state)
export default class Header extends React.Component {

    @autobind
    onToggle() {
        this.props.dispatch(showNav());
    }

    render () {
        const {session} = this.props;
        const isProvider = session.user && session.user.role == 'PROVIDER';
        return (
            <div className="header">
                <Navbar  expanded={session.showNav} onToggle={this.onToggle}>
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
                        </Nav>
                        <Nav pullRight>
                            {session.isLoggedIn ? (
                                <NavItem href="/api/auth/logout?redirect=/">Log out</NavItem>
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