import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import RadioGroup from '../../components/form/RadioGroup';
import { signup } from '../../redux/modules/session';
import { createToast } from '../../redux/modules/toast';
import { createValidator, required, email } from '../../utils/validator';

const ROLE_OPTIONS = [
    {label: 'I\'m an user', value: 'USER'},
    {label: 'I\'m a Provider', value: 'PROVIDER'},
];

@reduxForm({
    form: 'signup',
    fields: ['email', 'password', 'role', 'name'],
    validate: createValidator({
        email: [required(), email],
        password: required(),
        role: required(),
        name: required()
    }),
    initialValues: {
        role: 'USER'
    }
})
@connect(state=>state, {signup})
export default class Signup extends React.Component {

    @autobind
    submit(data){
        return this.props.signup(data).then(
            r => {
                this.props.dispatch(createToast('Registration successful!'));
                this.props.dispatch(push('/login'));
            }
        )
    }

    render() {
        const {fields: {email, password, role, name}, handleSubmit, submitting, error} = this.props;
        return (
            <div>
                <h3>Sign up for an account</h3>
                <form onSubmit={handleSubmit(this.submit)}>
                    {error && <Alert bsStyle="danger">{error}</Alert> }
                    <RadioGroup options={ROLE_OPTIONS} field={role} label="What's your role?" />
                    <Input field={name} label="Your name" />
                    <Input field={email} label="Email" type="email" />
                    <Input type="password" field={password} label="Password" />
                    <Button disabled={submitting} type="submit" bsStyle="primary">Register</Button>
                </form>
            </div>
        )
    }
}