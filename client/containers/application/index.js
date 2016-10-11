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
import DatePicker from '../../components/form/DatePicker';
import NumberInput from '../../components/form/NumberInput';
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
        receivableDate: required(),
        buyerCompany: required(),
        buyerContactPerson: required(),
        buyerEmail: required(),
        isExporter: required(),
        buyerConsent: (val) =>  !val ? 'Required' : null,
        rateOfInterest: [integer(), required()],
        tenor: required(),
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
            <div className="col-xs-6">
                <h3>Create new Loan application</h3>
                {this.state.success ? (
                    <Alert bsStyle="success">Your application have been received.</Alert>
                ) : (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <NumberInput field={receivable} label="Receivable Value" min={0} required />
                        <DatePicker field={receivableDate} label="Receivable Payment Date" required />
                        <File field={documents.report} label="Select latest annual report" required />
                        <File field={documents.pan} label="Select PAN document" required />
                        <File field={documents.coi} label="Select certificate of incorporation document" required />
                        <File field={documents.receivable} label="Select receivable document" required />
                        <Input field={buyerCompany} label="Buyer company name" required />
                        <Input field={buyerContactPerson} label="Buyer contact person" required />
                        <Input field={buyerEmail} type="email" label="Buyer email" required />
                        <Checkbox field={isExporter} label="Is the Co an Exporter" />
                        <Checkbox field={buyerConsent} label="Consent to check Receivable validity from Buyer" required />
                        <NumberInput field={loanAmount} label="Loan amount" min={0} required />
                        <NumberInput field={rateOfInterest} label="Rate of interest" min={0} required />
                        <Select field={tenor} options={TENOR} label="Tenor of Loan" required />
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