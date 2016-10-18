/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import UIDate from '../../components/UIDate';
import map from 'lodash/map';
import DetailsSection from '../application/components/DetailsSection';
import { getApplication, assignToLenders, changeStatus, createLoanAccount, requestDetails } from '../../redux/modules/applications';
import { getLenders } from '../../redux/modules/users';
import { createToast } from '../../redux/modules/toast';
import CheckboxList from '../../components/CheckboxList';


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

    componentWillReceiveProps(nextProps) {
        if(nextProps.applications.viewing && nextProps.applications.viewing != this.props.applications.viewing) {
            this.setState({
                lenders: map(nextProps.applications.viewing.lenders, '_id')
            })
        }
    }

    @autobind
    assignLenders() {
        this.props.dispatch(assignToLenders(this.props.params.id,this.state.lenders)).then(
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
        if(doc.receivableStatus == 'approved' && doc.status == 'APPROVED' && !doc.account) {
            const {lenders} = this.state;
            const {users} = this.props;
            return (
                <Col md={3}>
                    <h5>Assign Lenders</h5>
                    <CheckboxList
                        value={lenders}
                        options={users.lenders}
                        onChange={this.onLenderSelect}
                        labelKey="company"
                        valueKey="_id"
                    />
                    <br />
                    <Button onClick={this.assignLenders}>Submit</Button>
                </Col>
            )
        } else {
            return null;
        }
    }

    @autobind
    createLoanAccount() {
        this.props.dispatch(createLoanAccount(this.props.params.id));
    }

    renderProposals(doc) {
        if(doc.status != 'APPROVED' || doc.account) return;

        const offers = doc.proposals.map((i, idx) => (
          <div className="well well-sm" key={idx}>
              <Row>
                  <Col xs={3}>
                      <h5>{i.lender.company}</h5>
                      <p>{i.comment}</p>
                  </Col>
                  <Col xs={2}>
                      <strong>Loan amount: </strong> <span>{i.loanAmount}</span>
                  </Col>
                  <Col xs={2}><strong>Interest %</strong> <span>{i.interestRate}</span></Col>
                  <Col xs={2}><strong>Tenor</strong> <span>{i.tenor} days</span></Col>
                  <Col xs={3}><UIDate date={i.createdAt} /></Col>
              </Row>
          </div>
        ));
        return (
            <div>
                <h4 className="flex center">
                    <div className="flex-item">Proposals</div>
                    {offers.length ? (
                        <div><Button bsStyle="primary" onClick={this.createLoanAccount}>Create Loan account</Button></div>
                    ) : null}
                </h4>
                {offers}
            </div>
        )
    }

    changeStatus(status) {
        this.props.dispatch(changeStatus(this.props.params.id, status));
    }

    renderActions(application) {
        const btns = [];
        const status = application.status;
        if(status == 'PENDING') {
            btns.push(<Button bsStyle="primary" onClick={this.requestInfo}>Request info</Button>);
            btns.push(<Button bsStyle="success" onClick={e => this.changeStatus('UNDER_REVIEW')}>Under review</Button>);
            btns.push(<Button bsStyle="danger" onClick={e => this.changeStatus('REJECTED')}>Reject</Button>)
        } else if(status == 'UNDER_REVIEW') {
            btns.push(<Button bsStyle="primary" onClick={this.requestInfo}>Request info</Button>);
            if(application.receivableStatus == 'approved') {
                btns.push(<Button bsStyle="success" onClick={e => this.changeStatus('APPROVED')}>Approve</Button>);
            }
            btns.push(<Button bsStyle="danger" onClick={e => this.changeStatus('REJECTED')}>Reject</Button>);
        }
        return btns;
    }

    render() {
        const {applications: {viewing}} = this.props;

        if(!viewing) return <h5>Loading...</h5>;

        return (
            <div>
                <h3>
                    <div className="pull-left">Application details</div>
                    <div className="pull-right actions">
                        {this.renderActions(viewing)}
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