/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import Numeric from 'react-numeric-input';
import classNames from 'classnames';

export default class NumberInput extends React.Component {
    static propTypes = {
        field: React.PropTypes.object.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
    }

    render() {
        const {field, label, className, ...rest} = this.props;
        const classes = classNames('form-group', className, {'has-error': field && field.touched && field.error});
        return (
            <div className={classes}>
                {label && <label>{label}</label>}
                <Numeric className="form-control" style={false} {...field} />
                {field && field.touched && field.error && <div className="text-error help-block sm">{field.error}</div>}
            </div>
        )
    }
}
