import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import RadioGroup from '../../components/form/RadioGroup';
import Checkbox from '../../components/form/Checkbox';
import { signup } from '../../redux/modules/session';
import { createToast } from '../../redux/modules/toast';
import { createValidator, required, email } from '../../utils/validator';

const ROLE_OPTIONS = [
    {label: 'I\'m buyer', value: 'BUYER'},
    {label: 'I\'m a borrower', value: 'BORROWER'},
];

@reduxForm({
    form: 'signup',
    fields: [
        'name',
        'email',
        'password',
        'role',
        'company',
        'pan',
        'phone',
        'contactPerson',
        'designation',
        'businessType',
        'country',
        'city',
        'address',
        'phoneCode',
        'sector',
        'subSector',
        'tos'
    ],
    validate: createValidator({
        name: required(),
        email: [required(), email],
        password: required(),
        role: required(),
        company: required(),
        pan: required(),
        phone: required(),
        contactPerson: required(),
        designation: required(),
        businessType: required(),
        country: required(),
        city: required(),
        address: required(),
        phoneCode: required(),
        tos: required()

    }),
    initialValues: {
        role: 'SUPPLIER'
    }
})
@connect(state=>state, {signup})
export default class BuyerSupplier extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            success: false
        }
    }

    @autobind
    submit(data){
        return this.props.submit(data).then(
            () => this.setState({success: true})
        )
    }

    render() {
        const {
            fields: {
                name, email, password, role, company, pan, phone, contactPerson,
                designation, businessType, address, city, country, phoneCode, sector, subSector, tos},
            handleSubmit, submitting, error} = this.props;

        return (
            <div>
                {this.state.success ? (
                    <Alert bsStyle="success">Your application received and pending approval.</Alert>
                ) : (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <RadioGroup options={ROLE_OPTIONS} field={role} label="What's your role?" />
                        <Input field={name} label="Full name" />
                        <Input field={email} label="Email" type="email" />
                        <Input field={company} label="Company name" />
                        <Input field={sector} label="Sector" />
                        <Input field={subSector} label="Sub-sector" />
                        <Input type="password" field={password} label="Password" />
                        <Input field={pan} label="PAN" />
                        <Input field={phoneCode} label="Phone country code" />
                        <Input field={phone} label="Contact number" />
                        <Input field={contactPerson} label="Contact person" />
                        <Input field={designation} label="Designation" />
                        <Input field={businessType} label="Nature of Business" />
                        <Input field={address} label="Address" />
                        <Input field={city} label="City" />
                        <Input field={country} label="Country" />
                        <Checkbox field={tos} label="I agree to Terms of Service" />
                        <Button bsSize="large" block disabled={submitting} type="submit" bsStyle="primary">Register</Button>
                    </form>
                )}
            </div>
        )
    }
}