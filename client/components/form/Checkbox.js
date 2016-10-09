/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import isNill from 'lodash/isNil';

export default class Checkbox extends Component {

    // componentWillMount(){
    //     const val = this.props.field.value;
    //
    //     if(!isNill(val) || !val ){
    //         debugger;
    //         this.props.field.onChange(val);
    //     }
    // }

    // shouldComponentUpdate(nextProps){
    //     return nextProps.field.value !== this.props.field.value;
    // }

    render() {
        const {field, label, className, checked, ...rest} = this.props;
        const classes = classNames('checkbox', className, {
            'has-error': field && field.touched && field.error
        });

        const isChecked = checked !== undefined ? checked : field.value;

        return (
            <div className={classes}>
                <label>
                    <input type="checkbox" {...field} {...rest} checked={isChecked} />
                    {label}
                </label>
                {field && field.touched && field.error && <div className="text-error help-block">{field.error}</div>}
            </div>
        )
    }
}