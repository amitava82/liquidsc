import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import range from 'lodash/range';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import Checkbox from '../../components/form/Checkbox';
import Select from '../../components/form/Select';
import File from '../../components/form/File';

import { createApplication } from '../../redux/modules/applications';
import { createToast } from '../../redux/modules/toast';
import { createValidator, required, email, integer, file } from '../../utils/validator';

const TENOR = [30, 60, 90, 120, 180].map(i => ({label: i + ' days', value: i}));

@reduxForm({
    form: 'applicationForm',
    fields: [
        'receivable',
        'receivableDate',
        'documents.receivable',
        'documents.pan',
        'documents.coi',
        'documents.report',
        'buyerCompany',
        'buyerContactPerson',
        'buyerEmail',
        'isExporter',
        'buyerConsent',
        'loanAmount',
        'rateOfInterest',
        'tenor'
    ],
    initialValues: {
        isExporter: false,
        buyerConsent: false
    },
    validate: createValidator({
        loanAmount: [integer(),required()],
        receivable: [integer(),required()],
        buyerCompany: required(),
        buyerContactPerson: required(),
        buyerEmail: required(),
        isExporter: required(),
        documents: createValidator({
            receivable: file(),
            pan: file(),
            coi: file(),
            report: file()
        })
    })
})
@connect(state=>state, {createApplication})
export default class Application extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            success: false
        }
    }

    @autobind
    submit(data){
        return this.props.dispatch(createApplication(data)).then(
            () => this.setState({success: true})
        )
    }

    render() {
        const {
            fields: {loanAmount, receivable, receivableDate, buyerCompany, buyerContactPerson, buyerEmail, isExporter, documents, buyerConsent, rateOfInterest, tenor},
            handleSubmit, submitting, error} = this.props;

        const fees = (loanAmount.value * (1.25/100)).toFixed(2);

        return (
            <div>
                <h3>Create new Loan application</h3>
                {this.state.success ? (
                    <Alert bsStyle="success">Your application have been received.</Alert>
                ) : (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <Input field={receivable} label="Receivable Value" type="number" />
                        <Input field={receivableDate} label="Receivable Payment Date" type="date" />
                        <File field={documents.report} label="Select latest annual report" />
                        <File field={documents.pan} label="Select PAN document" />
                        <File field={documents.coi} label="Select certificate of incorporation document" />
                        <File field={documents.receivable} label="Select receivable document" />
                        <Input field={buyerCompany} label="Buyer company name" />
                        <Input field={buyerContactPerson} label="Buyer contact person" />
                        <Input field={buyerEmail} type="email" label="Buyer email" />
                        <Checkbox field={isExporter} label="Is the Co an Exporter" />
                        <Checkbox field={buyerConsent} label="Consent to check Receivable validity from Buyer" />
                        <Input field={loanAmount} label="Loan amount" type="number" />
                        <Input field={rateOfInterest} label="Rate of interest" type="number" />
                        <Select field={tenor} options={TENOR} label="Tenor of Loan" />
                        <p>
                            <label className="text-info">Processing fees (1.25%): <strong>{fees}</strong></label>

                        </p>
                        <Button disabled={submitting} type="submit" bsStyle="primary">Submit</Button>
                    </form>
                )}
            </div>
        )
    }
}