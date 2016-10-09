import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import Checkbox from '../../components/form/Checkbox';
import File from '../../components/form/File';

import { createApplication } from '../../redux/modules/applications';
import { createToast } from '../../redux/modules/toast';
import { createValidator, required, email } from '../../utils/validator';

@reduxForm({
    form: 'applicationForm',
    fields: [
        'company',
        'receivable',
        'documents.financial',
        'documents.receivable',
        'documents.pan',
        'documents.coi',
        'documents.agreement',
        'buyerCompany',
        'buyerContactPerson',
        'buyerEmail',
        'isExporter'
    ],
    validate: createValidator({
        company: required(),
        receivable: required(),
        buyerCompany: required(),
        buyerContactPerson: required(),
        buyerEmail: required(),
        isExporter: required(),
        documents: required()
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
            fields: {company, receivable, buyerCompany, buyerContactPerson, buyerEmail, isExporter, documents},
            handleSubmit, submitting, error} = this.props;

        return (
            <div>
                <h1>Create new Loan application</h1>
                {this.state.success ? (
                    <Alert bsStyle="success">Your application have been received.</Alert>
                ) : (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <Input field={company} label="Company Name" />
                        <Input field={receivable} label="Receivable Value" type="number" />
                        <Input field={buyerCompany} label="Buyer company name" />
                        <Input field={buyerContactPerson} label="Buyer contact person" />
                        <Input field={buyerEmail} type="email" label="Buyer email" />
                        <Checkbox field={isExporter} label="Is the Co an Exporter" />
                        <File field={documents.financial} label="Select Financial documents" />
                        <File field={documents.pan} label="Select PAN documents" />
                        <Button disabled={submitting} type="submit" bsStyle="primary">Submit</Button>
                    </form>
                )}
            </div>
        )
    }
}