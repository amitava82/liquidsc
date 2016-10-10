/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';

import { getApplication, assignToLenders, rejectApplication } from '../../redux/modules/applications';
import { getLenders } from '../../redux/modules/users';

@connect(state=>state)
export default class ApplicationDetails extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            lenders: []
        }
    }

    componentWillMount() {
        this.props.dispatch(getApplication(this.props.params.id));
        this.props.dispatch(getLenders());
    }

    @autobind
    assignLenders() {
        this.props.dispatch(assignToLenders(this.props.params.id, map(this.state.lenders, '_id')));
    }

    @autobind
    onLenderSelect(values) {
        this.setState({lenders: values});
    }

    renderAssignAction(doc) {
        if(doc.receivableStatus == 'approved') {
            const {lenders} = this.state;
            const {users} = this.props;
            return (
                <Col md={3}>
                    <h5>Assign Lenders</h5>
                    <Select
                        multi={true}
                        value={lenders}
                        options={users.lenders}
                        onChange={this.onLenderSelect}
                        labelKey="company"
                        valueKey="id"
                    />
                    <br />
                    <Button onClick={this.assignLenders}>Submit</Button>
                    <div>
                        <h5>Assigned lenders</h5>
                        {doc.lenders.map(i => (
                            <p>{i.company}</p>
                        ))}
                    </div>
                </Col>
            )
        } else {
            return null;
        }
    }

    renderOffers(doc) {
        const offers = doc.offers.map(i => (
          <p></p>
        ));
        return offers;
    }

    render() {
        const {applications: {viewing}} = this.props;

        if(!viewing) return <h5>Loading...</h5>;

        const docs = viewing.documents.map(doc => <p><a href={`/api/applications/${viewing._id}/docs/${doc.fieldname}`}>{doc.fieldname}</a></p>);

        return (
            <div>
                <h3>Application details</h3>
                <Row>
                    <Col md={9}>
                        <h4>Details</h4>
                        <dl className="dl-horizontal">
                            <dt>ID</dt>
                            <dd>{viewing._id}</dd>
                            <dt>Created</dt>
                            <dd>{new Date(viewing.createdAt).toDateString()}</dd>
                            <dt>Created</dt>
                            <dd>{new Date(viewing.updatedAt).toDateString()}</dd>
                            <dt>Company</dt>
                            <dd>{viewing.company.company}</dd>
                            <dt>Loan Amount</dt>
                            <dd>{viewing.loanAmount}</dd>
                            <dt> RECEIVABLE STATUS</dt>
                            <dd>{viewing.receivableStatus}</dd>
                            <dt>STATUS</dt>
                            <dd>{viewing.status}</dd>
                        </dl>
                        <h4>Documents</h4>
                        {docs}
                        <h4>Lenders</h4>
                        <div>
                            {this.renderOffers(viewing)}
                        </div>
                    </Col>
                    {this.renderAssignAction(viewing)}
                </Row>
            </div>
        )
    }
}