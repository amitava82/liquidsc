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

import NumberInput from '../../components/form/NumberInput';
import Input from '../../components/form/PureInput';
import Select from '../../components/form/Select';
import TextArea from '../../components/form/Textarea';

const TENOR = [30, 60, 90, 120, 180].map(i => ({label: i + ' days', value: i}));

import { submitProposal } from '../../redux/modules/applications';

@reduxForm({
    form: 'proposalForm',
    fields: [
        'loanAmount',
        'interestRate',
        'tenor',
        'comment'
    ],
    validate: createValidator({
        loanAmount: required(),
        interestRate: required(),
        tenor: required()
    })
})
@connect(state=>state)
export default class ApplicationDetails extends React.Component {

    @autobind
    submit(data) {
        return this.props.dispatch(submitProposal(this.props.id, data)).then(
            () => this.props.dispatch(push('/home'))
        )
    }

    render() {
        const {applications: {viewing},
            fields: {loanAmount, interestRate, tenor, comment}, handleSubmit, submitting} = this.props;

        if(!viewing) return <h5>Loading...</h5>;


        return (
            <div>
                <h4>Submit Bid</h4>
                <form onSubmit={handleSubmit(this.submit)}>
                    <NumberInput field={loanAmount} label="Loan amount" min={1} required/>
                    <NumberInput field={interestRate} label="Interest rate"  min={0} required />
                    <Select field={tenor} options={TENOR} label="Tenor" required />
                    <TextArea field={comment} label="Comments" />
                    <button disabled={submitting} className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}