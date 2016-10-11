/**
 * Created by amita on 10/11/2016.
 */
/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import autobind from 'autobind-decorator';
import { reduxForm } from 'redux-form';

import File from '../../components/form/File';
import Input from '../../components/form/PureInput';

import Api from '../../utils/api';
const api = new Api();

@reduxForm({
    form: 'uploadForm',
    fields: [
        'documents[].type',
        'documents[].file',
    ]
})
export default class UpdateAccount extends React.Component {

    componentWillMount() {
        this.props.fields.documents.addField();
    }

    @autobind
    submit(data) {
        console.log(data);
        const files = data.documents.map(i => ({field: i.type, value: i.file[0]}));
        return api.post(`applications/${this.props.id}/upload`, {files, data: {}}).then(
            () => this.props.onHide()
        )
    }

    render() {
        const { onHide, fields: {documents}, handleSubmit, submitting } = this.props;
        return (
            <Modal show={true} onHide={onHide}>
                <Modal.Body>
                    <form onSubmit={handleSubmit(this.submit)}>
                        {documents.map((doc, idx) => (
                            <div key={idx}>
                                <Input field={doc.type} placeholder="e.g., bank statement" label="Document type" />
                                <File field={doc.file} label="Select file" />
                                <Button className="btn btn-link btn-sm" type="button" onClick={e => documents.removeField(idx)}>Delete</Button>
                            </div>
                        ))}
                        <Button className="btn btn-link btn-sm" type="button" onClick={e => documents.addField()}>Add another</Button>
                        <div>
                            <Button bsStyle="primary" disabled={submitting} type="submit">Upload</Button>
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}