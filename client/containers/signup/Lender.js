import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import Select from '../../components/form/Select';
import { signup } from '../../redux/modules/session';
import { createToast } from '../../redux/modules/toast';
import { createValidator, required, email } from '../../utils/validator';

const LENDER_TYPES = 'Accredited Investor,Individual,Company,Bank,NBFC,Fund,Others'.split(',').map(i => ({label: i, value: i}));

@reduxForm({
    form: 'signup',
    fields: [
        'name',
        'email',
        'password',
        'role',
        'fullName',
        'company',
        'lenderType',
        'designation',
        'phone',
        'comments',
        'country',
        'city',
        'address',
        'phoneCode'
    ],
    validate: createValidator({
        name: required(),
        email: [required(), email],
        password: required(),
        role: required(),
        company: required(),
        fullName: required(),
        lenderType: required(),
        phone: required(),
        designation: required(),
        country: required(),
        city: required(),
        address: required(),
        phoneCode: required()
    }),
    initialValues: {
        role: 'LENDER'
    }
})
@connect(state=>state, {signup})
export default class Lender extends React.Component {
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
            fields: {name, email, password, company, fullName, phone, lenderType, designation, comments, address, city, country, phoneCode},
            handleSubmit, submitting, error} = this.props;

        return (
            <div>
                {this.state.success ? (
                    <Alert bsStyle="success">Your application received and pending approval.</Alert>
                ) : (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <Input field={name} label="Your name" />
                        <Input field={company} label="Company Name/Individual Name" />
                        <Input field={email} label="Email" type="email" />
                        <Input type="password" field={password} label="Password" />
                        <Input field={fullName} label="Full name" />
                        <Input field={phoneCode} label="Phone country code" />
                        <Input field={phone} label="Contact number" />
                        <Select field={lenderType} options={LENDER_TYPES} label="Lender type" required />
                        <Input field={designation} label="Designation" />
                        <Input field={address} label="Address" />
                        <Input field={city} label="City" />
                        <Input field={country} label="Country" />

                        <Input field={comments} label="Comments" />
                        <Button  bsSize="large" block disabled={submitting} type="submit" bsStyle="primary">Register</Button>
                    </form>
                )}
            </div>
        )
    }
}