import React, {Component, PropTypes} from 'react';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';

export default class MultiCheckbox extends Component {
    constructor() {
        super();

        this.getCurrentValues = this.getCurrentValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getCurrentValues() {
        const {value, initialValue} = this.props;

        let previousValues = [];

        if (!isUndefined(value) && value !== '') {
            previousValues = value;
        }
        else if (!isUndefined(initialValue) && initialValue !== '') {
            previousValues = initialValue;
        }

        const currentValues = isArray(previousValues) ? [...previousValues] : [previousValues];

        return currentValues;
    }

    handleChange(event, id) {
        const {onChange} = this.props;
        const values = this.getCurrentValues();

        if (event.target.checked) {
            values.push(id);
        }
        else {
            values.splice(values.indexOf(id), 1);
        }

        return onChange(values);
    }

    render() {
        const {options, onBlur, ...rest} = this.props;
        const values = this.getCurrentValues();

        const checkboxes = options.map(option => {
            const isChecked = values.indexOf(option.value) > -1;

            return (
                <div key={option.value}
                     className="checkbox">
                    <label>
                        <input
                            type="checkbox"
                            {...rest}
                            onChange={event => this.handleChange(event, option.value)}
                            onBlur={() => onBlur(values)}
                            checked={isChecked}
                            value={option.value}
                        />

                        {option.label}
                    </label>
                </div>
            );
        });

        return (
            <div className="checkboxes">
                {checkboxes}
                {rest.touched && rest.error && <div className="text-error help-block">{rest.error}</div>}
            </div>
        );
    }
}