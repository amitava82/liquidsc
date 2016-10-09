/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class Textarea extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired
    };

    shouldComponentUpdate(nextProps) {
        return this.props.field !== nextProps.field;
    }

    render() {
        const {field, label, ...rest} = this.props;

        return (
            <div className={classNames('textarea form-group', {'has-error': field && field.touched && field.error})}>
                {label && <label className="control-label">{label}</label>}
                <textarea className="form-control" {...field} value={field && field.value || ''} {...rest} />
                {field && field.touched && field.error && <div className="text-error help-block sm">{field.error}</div>}
            </div>
        )
    }
}