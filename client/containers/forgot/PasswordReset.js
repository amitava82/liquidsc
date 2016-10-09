import React from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import { requestResetPassword } from '../../redux/modules/session';
import { createValidator, required, email } from '../../utils/validator';

@reduxForm({
    form: 'forgot',
    fields: ['email'],
    validate: createValidator({
        email: [required(), email]
    })
})
@connect(state=>state, {requestResetPassword})
export default class PasswordReset extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            success: false,
            error: null
        }
    }
    componentWillMount() {
        if(this.props.session.isLoggedIn){
            this.props.dispatch(push('/home'));
        }
    }

    @autobind
    submit(data){
        this.setState({error: null});
        return this.props.requestResetPassword(data.email).then(
            r => {
                this.setState({success: true})
            },
            e => this.setState({error: e.message})
        )
    }

    render() {
        const {success} = this.state;
        const {fields: {email}, handleSubmit, submitting, error} = this.props;
        return (
            <div>
                <h3>Reset password</h3>
                {!success ? (
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <Input field={email} label="Email" />
                        <Button disabled={submitting} type="submit" bsStyle="primary">Submit</Button>
                        &nbsp; <Link to="/login" className="brn btn-default">Cancel</Link>
                    </form>
                ) : (
                    <Alert bsStyle="success">Success! Please check your email for instructions.</Alert>
                )}
            </div>
        )
    }
}