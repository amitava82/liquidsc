/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Radio extends Component {

    render() {
        const {field, label, className, key, ...rest} = this.props;
        const classes = classNames('radio', className, {
            'has-error': field && field.touched && field.error
        });

        return (
            <div className={classes} key={key}>
                <label>
                    <input type="radio" {...field} {...rest}/>
                    {label}
                </label>
                {field && field.touched && field.error && <div className="text-error help-block">{field.error}</div>}
            </div>
        )
    }
}