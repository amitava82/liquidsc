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

const LENDER_TYPES = 'Accredited Investor Individual Company Bank NBFC Fund Others'.split(' ').map(i => ({label: i, value: i}));

@reduxForm({
    form: 'signup',
    fields: [
        'email',
        'password',
        'role',
        'fullName',
        'company',
        'lenderType',
        'designation',
        'phone',
        'comments',
    ],
    validate: createValidator({
        email: [required(), email],
        password: required(),
        role: required(),
        company: required(),
        fullName: required(),
        lenderType: required(),
        phone: required(),
        designation: required()
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
            fields: {email, password, company, fullName, phone, lenderType, designation, comments},
            handleSubmit, submitting, error} = this.props;

        return (
            <div>
                {this.state.success ? (
                    <Alert bsStyle="success">Your application received and pending approval.</Alert>
                ) : (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <Input field={company} label="Company Name/Individual Name" />
                        <Input field={email} label="Email" type="email" />
                        <Input type="password" field={password} label="Password" />
                        <Input field={fullName} label="Full name" />
                        <Input field={phone} label="Contact number" />
                        <Select field={lenderType} options={LENDER_TYPES} label="Lender type" required />
                        <Input field={designation} label="Designation" />
                        <Input field={comments} label="Comments" />
                        <Button disabled={submitting} type="submit" bsStyle="primary">Register</Button>
                    </form>
                )}
            </div>
        )
    }
}