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
import DetailsSection from '../application/components/DetailsSection';
import { getApplication, assignToLenders, rejectApplication, createLoanAccount, requestDetails } from '../../redux/modules/applications';
import { getLenders } from '../../redux/modules/users';
import { createToast } from '../../redux/modules/toast';

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
        this.props.dispatch(assignToLenders(this.props.params.id, map(this.state.lenders, '_id'))).then(
            () => this.props.dispatch(createToast('Assigned to lenders.'))
        )
    }

    @autobind
    onLenderSelect(values) {
        this.setState({lenders: values});
    }

    @autobind
    requestInfo() {
        const info = prompt('Please enter information to be requested:');
        if(info) {
            this.props.dispatch(requestDetails(this.props.params.id, info)).then(
                () => alert('Request sent')
            )
        }
    }

    renderAssignAction(doc) {
        if(doc.receivableStatus == 'approved' && doc.status == 'PENDING') {
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

    createLoanAccount(id) {
        this.props.dispatch(createLoanAccount(id));
    }

    renderProposals(doc) {
        if(doc.status != 'PENDING') return;

        const offers = doc.proposals.map(i => (
          <div className="well well-sm">
              <Row>
                  <Col xs={6}>
                      <h5>{i.lender.company}</h5>
                      <p>{i.comment}</p>
                  </Col>
                  <Col xs={4}>
                      <div><strong>Loan amount: </strong> <span>{i.loanAmount}</span></div>
                      <div><strong>Interest rate:</strong> <span>{i.interestRate}</span></div>
                      <div><strong>Tenor</strong> <span>{i.tenor}</span></div>
                  </Col>
                  <Col xs={2}>
                    <Button bsStyle="primary" onClick={e => this.createLoanAccount(i._id)}>Select</Button>
                  </Col>
              </Row>
          </div>
        ));
        return (
            <div>
                <h4>Proposals</h4>
                {offers}
            </div>
        )
    }

    render() {
        const {applications: {viewing}} = this.props;

        if(!viewing) return <h5>Loading...</h5>;

        const docs = viewing.documents.map(doc => <div><a target="_blank" href={`/api/applications/${viewing._id}/docs/${doc.fieldname}`}>{doc.fieldname}</a> </div>);

        return (
            <div>
                <h3>
                    <div className="pull-left">Application details</div>
                    <div className="pull-right">
                        {viewing.status == 'PENDING' && <Button bsStyle="primary" onClick={this.requestInfo}>Request info</Button>}
                    </div>
                </h3>
                <Row>
                    <DetailsSection data={viewing}>
                        {this.renderProposals(viewing)}
                    </DetailsSection>
                    {this.renderAssignAction(viewing)}
                </Row>
            </div>
        )
    }
}