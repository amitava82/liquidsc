import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';

import AdminDashboard from './AdminDashboard';
import LenderDashboard from './LenderDashboard';
import BorrowerDashboard from './BorrowerDashboard';
import BuyerDashboard from './BuyerDashboard';

@connect(state=>state)
export default class Home extends React.Component {

    render() {
        const { session: {user}}  = this.props;
        const role = user.role;

        switch (role) {
            case 'ADMIN': return <AdminDashboard/>;
            case 'BORROWER': return <BorrowerDashboard/>;
            case 'BUYER': return <BuyerDashboard />;
            case 'LENDER': return <LenderDashboard />;
        }
    }
}