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

import BuyerSupplierFrom from './BuyerSupplier';
import LenderForm from './Lender';

@connect(state=>state, {signup})
export default class Signup extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            type: null,
            success: false
        }
    }

    @autobind
    submit(data){
        return this.props.signup(data);
    }

    render() {
        const {type} = this.state;
        let content = (
            <div>
                <Button bsSize="large" block onClick={e => this.setState({type: 'lender'})} bsStyle="primary">Register for Lender account</Button>
                <br />
                <Button bsSize="large" block onClick={e => this.setState({type: 'buyer'})} bsStyle="primary">Register for Buyer/Supplier</Button>
            </div>
        );
        if(type == 'buyer') {
            content = <BuyerSupplierFrom submit={this.submit} />
        } else if(type == 'lender') {
            content = <LenderForm submit={this.submit} />;
        }

        return (
            <div  className="col-xs-6 col-xs-offset-3 form-container">
                <div  className="text-center form-header">
                    <h3>Sign up</h3>
                </div>
                <div className="form-content">
                    {content}
                </div>
            </div>
        )
    }
}