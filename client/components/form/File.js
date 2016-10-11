
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class File extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
    }

    render() {
        const {field, label, className, required, ...rest} = this.props;
        const classes = classNames('form-group', className, {'has-error': field && field.touched && field.error});
        const fieldClass = classNames('form-control', {'has-error': field && field.touched && field.error});
        const labelClass = classNames({required, });
        return (
            <div className={classes}>
                {label && <label className={labelClass}>{label}</label>}
                <input type="file" className={fieldClass} {...field} {...rest} value={null} />
                {field && field.touched && field.error && <div className="text-error help-block sm">{field.error}</div>}
            </div>
        )
    }
}