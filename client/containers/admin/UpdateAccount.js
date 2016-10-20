/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import autobind from 'autobind-decorator';

export default class UpdateAccount extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            disbursementDate: null,
            rate: ''
        }
    }

    @autobind
    onChange(v) {
        this.setState({
            disbursementDate: v
        });
    }


    @autobind
    submit() {
        if(this.state.disbursementDate) {
            this.props.onSubmit(this.state.disbursementDate.toDate());
        }
    }

    render() {
        const { onHide } = this.props;
        return (
            <Modal show={true} onHide={onHide}>
                <Modal.Header closeButton onHide={onHide}>
                    <Modal.Title>Update account</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <label>Disbursement Date</label>
                    <DatePicker selected={this.state.disbursementDate} onChange={this.onChange}  />
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.submit}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}