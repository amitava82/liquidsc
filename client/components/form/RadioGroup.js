/**
 * Created by amita on 9/24/2016.
 */
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class RadioGroup extends React.Component {

    render() {
        const {options, field, name, label} = this.props;

        const elem = options.map(i => (
            <div className="radio" key={i.value}>
                <label>
                    <input {...field} name={name} type="radio" value={i.value} checked={field.value == i.value} /> {i.label}
                </label>
            </div>
        ));

        return (
            <div>
                <label>{label}</label>
                {elem}
                {field.touched && field.error && <div className="text-error help-block">{field.error}</div>}
            </div>
        )
    }
}