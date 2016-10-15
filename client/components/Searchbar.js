/**
 * Created by amita on 10/14/2016.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import { reduxForm, reset } from 'redux-form';
import find from 'lodash/find';
import Select from './form/Select';
import Input from './form/PureInput';
import NumberInput from './form/NumberInput';
import each from 'lodash/each';
import { Button, FormControl, Row, Col, Glyphicon } from 'react-bootstrap';
import { createValidator, required } from '../utils/validator';

const OPERATORS = [
    {label: 'Equals', value: '='},
    {label: 'Contains', value: 'contains'},
    {label: 'Greater than', value: 'gt'},
    {label: 'Less than', value: 'lt'},
];

const FIELDS = [
    {label: 'ID', value: '_id'},
    {label: 'Company name', value: 'company'},
    {label: 'Email', value: 'email'},
];

@reduxForm({
    form: 'filterForm',
    fields: [
        'filters[].field',
        'filters[].operator',
        'filters[].value',
    ],
    validate: createValidator({
        filters: data => data.map(createValidator({
            field: required(),
            operator: required(),
            value: required()
        }))
    })
})
export default class Searchbar extends React.Component {
    constructor(...args){
        super(...args);
    }

    componentWillMount() {
        this.props.fields.filters.addField({field: '_id', operator: '='});
    }

    @autobind
    submit(data) {
        this.props.onSearch(data.filters);
    }

    @autobind
    reset() {
        //this.props.dispatch(reset('filterForm'));
        this.props.initializeForm({});
        this.props.fields.filters.addField({field: '_id', operator: '='});
        this.props.onSearch([]);
    }

    renderInput(filter, filterOptions) {
        const {field, options} = filter;
        const f = find(filterOptions, {value: field.value});
        if(f && f.options) {
            return <Select field={filter.value} options={f.options.map(i => ({label: i, value: i}))}/>
        }
        return <Input field={filter.value} placeholder="search text" />;
    }

    render() {
        const {fields: {filters}, handleSubmit} = this.props;
        const filterOptions = this.props.filters || FIELDS;
        return (
            <form onSubmit={handleSubmit(this.submit)}>
                {filters.map((i, idx) => (
                    <div className="flex column">
                        <div className="flex">
                            <div className="flex-item">
                                <Select field={i.field} options={filterOptions} selectLabel="Select field"/>
                            </div>
                            <div className="flex-item">
                                <Select field={i.operator} options={OPERATORS} selectLabel="Select operator"/>
                            </div>
                            <div className="flex-item">
                                {this.renderInput(i, filterOptions)}
                            </div>
                            <div className="flex-item">
                                <Button bsStyle="primary" onClick={e => filters.addField({operator: '='})}><Glyphicon glyph="plus" /></Button>
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

export function buildQuery(query) {
    const q = {};
    each(query, (val) => {
        switch (val.operator) {
            case '=':
                q[val.field] = val.value;
                break;
            case 'contains':
                q[val.field] = {$regex: val.value, $options: 'i'};
                break;
            case 'gt':
                q[val.field] = {$gt: val.value};
                break;
            case 'lt':
                q[val.field] = {$lt: val.value};
                break;
        }
    });

    return q;
}