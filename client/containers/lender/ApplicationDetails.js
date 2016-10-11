/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import DetailsSection from '../application/components/DetailsSection';
import SubmitProposal from './SubmitProposal';

import { getApplication } from '../../redux/modules/applications';
import Api from '../../utils/api';
const api = new Api();

@connect(state => state)
export default class ApplicationDetails extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            loading: true,
            proposal: null
        }
    }

    componentWillMount() {
        const id = this.props.params.id;
        this.props.dispatch(getApplication(id));
        api.get(`applications/${id}/proposals`).then(
            doc => this.setState({loading: false, proposal: doc})
        )

    }

    render() {
        const {applications: {viewing}} = this.props;
        const {loading, proposal} = this.state;

        if(!viewing) return <h5>Loading...</h5>;

        return (
            <div>
                <h3>Application details</h3>
                <Row>
                    <DetailsSection data={viewing} />
                    <Col md={3}>
                        {loading ? (
                            <h5>Loading...</h5>
                        ) : proposal ? (
                            <div>
                                <h4>Submitted proposal</h4>
                                <p><strong>Amount: </strong> {proposal.loanAmount}</p>
                                <p><strong>Rate: </strong> {proposal.interestRate}%</p>
                                <p><strong>Tenor: </strong> {proposal.tenor} days</p>
                                <p><strong>Status: </strong> {proposal.status}</p>
                            </div>
                        ) : (
                            <SubmitProposal id={this.props.params.id} />
                        )}

                    </Col>
                </Row>
            </div>
        )
    }
}