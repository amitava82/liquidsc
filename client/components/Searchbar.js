/**
 * Created by amita on 10/14/2016.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import { reduxForm } from 'redux-form';
import Select from './form/Select';
import Input from './form/PureInput';
import NumberInput from './form/NumberInput';
import { Button, FormControl, Row, Col, Glyphicon } from 'react-bootstrap';

const OPERATORS = [
    {label: '=', value: '='},
    {label: 'gt', value: '>'},
    {label: 'lt', value: '<'},
];

const FIELDS = []

@reduxForm({
    form: 'filterForm',
    fields: [
        'filters[].field',
        'filters[].operator',
        'filters[].value',
    ]
})
export default class Searchbar extends React.Component {
    constructor(...args){
        super(...args);
        this.state = {
            field: '',
            query: ''
        }
    }

    componentWillMount() {
        this.props.fields.filters.addField();
    }

    @autobind
    onChange(e) {

    }

    @autobind
    submit(data) {
        console.log(data);
    }

    @autobind
    reset() {
        this.props.initializeForm({filters: []});
        this.props.fields.filters.addField();
    }

    render() {
        const {fields: {filters}, handleSubmit} = this.props;
        const content = null;
        return (
            <form onSubmit={handleSubmit(this.submit)}>
                {filters.map((i, idx) => (
                    <div className="flex column">
                        <div className="flex">
                            <div className="flex-item">
                                <Select field={i.field} options={[]} selectLabel="Select field"/>
                            </div>
                            <div className="flex-item">
                                <Select field={i.operator} options={[]} selectLabel="Select operator"/>
                            </div>
                            <div className="flex-item">
                                <Input field={i.value} placeholder="search text" />
                            </div>
                            <div className="flex-item">
                                <Button bsStyle="primary" onClick={e => filters.addField()}><Glyphicon glyph="plus" /></Button>
                                {' '}
                                {idx > 0 ? <Button bsStyle="danger" onClick={e => filters.removeField(idx)}><Glyphicon glyph="trash" /></Button> : null}
                            </div>
                        </div>
                    </div>
                ))}
                <Button type="button" onClick={this.reset} bsStyle="default" bsSize="large">RESET</Button>
                {' '}
                <Button type="submit" bsStyle="primary" bsSize="large">SEARCH</Button>
            </form>
        )
    }
}