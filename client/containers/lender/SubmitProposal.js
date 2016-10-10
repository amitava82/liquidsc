/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import { reduxForm } from 'redux-form';
import autobind from 'autobind-decorator';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import map from 'lodash/map';
import { createValidator, required } from '../../utils/validator';

import Input from '../../components/form/PureInput';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/Textarea';

const TENOR = [30, 60, 90, 120, 180].map(i => ({label: i + ' days', value: i}));

import { getApplication, submitProposal } from '../../redux/modules/applications';
import { getLenders } from '../../redux/modules/users';

@reduxForm({
    form: 'proposalForm',
    fields: [
        'loanAmount',
        'interestRate',
        'tenor',
        'comment'
    ]
})
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
    }

    @autobind
    submit(data) {
        this.props.dispatch(submitProposal(this.props.params.id, data)).then(
            () => this.props.dispatch(push('/home'))
        )
    }

    render() {
        const {applications: {viewing},
            fields: {loanAmount, interestRate, tenor, comment}, handleSubmit, submitting} = this.props;

        if(!viewing) return <h5>Loading...</h5>;


        return (
            <div>
                <h3>Submit proposal</h3>
                <Row>
                    <Col md={9}>
                       <form onSubmit={handleSubmit(this.submit)}>
                           <Input field={loanAmount} label="Loan amount"/>
                           <Input field={interestRate} label="Interest rate"/>
                           <Select field={tenor} options={TENOR} label="Tenor" />
                           <TextArea field={comment} label="Comments" />
                           <button className="btn btn-primary">Submit</button>
                       </form>
                    </Col>
                </Row>
            </div>
        )
    }
}