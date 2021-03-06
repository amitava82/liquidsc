import React from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { Button, Alert } from 'react-bootstrap';
import autobind from 'autobind-decorator';
import Input from '../../components/form/PureInput';
import { doLogin } from '../../redux/modules/session';
import { createValidator, required } from '../../utils/validator';

@reduxForm({
    form: 'login',
    fields: ['email', 'password'],
    validate: createValidator({
        email: required(),
        password: required()
    })
})
@connect(state=>state, {doLogin})
export default class Login extends React.Component {

    componentWillMount() {
        if(this.props.session.isLoggedIn){
            const to = this.props.session.user.role == 'admin' ? '/admin/analytics' : '/home';
            this.props.dispatch(push(to));
        }
    }

    @autobind
    submit(data){
        return this.props.doLogin(data).then(
            r => {
                this.props.dispatch(push('/home'));
            }
        )
    }
    
    render() {
        const {fields: {email, password}, handleSubmit, submitting, error} = this.props;
        return (
            <div className="col-xs-6 col-xs-offset-3 form-container">
                <div className="form-header">
                    <h3>Login</h3>
                </div>
                <div className="form-content">
                    <form onSubmit={handleSubmit(this.submit)}>
                        {error && <Alert bsStyle="danger">{error}</Alert> }
                        <Input field={email} label="Email" />
                        <Input type="password" field={password} label="Password" />
                        <div className="form-group">
                            <Link to="/forgot">Forgot password?</Link>
                        </div>
                        <Button bsSize="large" block disabled={submitting} type="submit" bsStyle="primary">Submit</Button>
                        <Link to="/signup" className="btn btn-default btn-outlined btn-block">Signup for an account</Link>
                    </form>
                </div>
            </div>
        )
    }
}