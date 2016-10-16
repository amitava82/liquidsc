/**
 * Created by amita on 10/9/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Pagination } from 'react-bootstrap';
import UIDate from '../../components/UIDate';
import { getApplications, buyerChangeStatus } from '../../redux/modules/applications';

@connect(state=>state)
export default class BuyerDashboard extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplications());
    }

    changeStatus(id, status) {
        this.props.dispatch(buyerChangeStatus(id, status));
    }

    @autobind
    gotoPage(page) {
        this.props.dispatch(getApplications({page: page}));
    }

    render() {
        const {applications: {data, page, pages}} = this.props;
        const rows = data.map(i => (
            <tr>
                <td>{i._id}</td>
                <td><UIDate date={i.createdAt}/></td>
                <td>{i.company.company}</td>
                <td>{i.loanAmount}</td>
                <td><a href={`/api/applications/${i._id}/docs/receivable`}>View</a></td>
                <td><UIDate date={i.receivableDate}  time={false} /></td>
                <td>{i.receivableStatus == 'pending' ? (
                    <div>
                        <button onClick={e => this.changeStatus(i._id, 'rejected')} className="btn btn-danger">Reject</button>
                        {' '}
                        <button onClick={e => this.changeStatus(i._id, 'approved')} className="btn btn-primary">Approve</button>
                    </div>
                ) : <span className="capitalize">{i.receivableStatus}</span>}</td>
            </tr>
        ));

        return (
            <div>
                <h3>Applications</h3>
                <table className="table table-striped table-bordered">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Application date</th>
                        <th>Borrower</th>
                        <th>Amount</th>
                        <th>Doc</th>
                        <th>Receivable date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
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
            </div>
        )
    }
}