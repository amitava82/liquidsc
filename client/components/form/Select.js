/**
 * Created by amitava on 12/02/16.
 */
import React, {Component, PropTypes} from 'react';
import sortBy from 'lodash/sortBy';
import autobind from 'autobind-decorator';
import classNames from 'classnames';

export default class Select extends Component {
    static propTypes = {
        field: PropTypes.object.isRequired,
        options: PropTypes.array.isRequired
    };

    //shouldComponentUpdate(nextProps) {
    //    return this.props.field !== nextProps.field;
    //}

    @autobind
    onChange(e) {
        const val = e.target.value;
        const {field, onChange} = this.props;
        field.onChange(val);
        if(onChange) {
            onChange(val);
        }
    }

    render() {
        const {field, options, label, selectLabel, ...rest} = this.props;

        const optionsList = options.map(i => {
            return <option key={i.value} value={i.value}>{i.label}</option>
        });

        const classes = classNames('form-group select', {'has-error': field && field.touched && field.error});

        return (
            <div className={classes}>
                {label && <label>{label}</label>}
                <select className="form-control" {...field} {...rest} onChange={this.onChange}>
                    <option value="">{ selectLabel || 'Select'}</option>
                    {optionsList}
                </select>
                {field && field.touched && field.error && <div className="text-error help-block sm">{field.error}</div>}
            </div>
        );
    }
}