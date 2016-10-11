/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import Picker from 'react-datepicker';
import extend from 'lodash/extend';
import classNames from 'classnames';
import moment from 'moment';
import map from 'lodash/map';
import autobind from 'autobind-decorator';

export default class DatePicker extends React.Component{

    @autobind
    onChange(val){
        this.props.field.onChange(val.toDate())
    }

    render(){
        const { field, className, label} = this.props;
        const value = field.value ? moment(field.value) : null;
        return (
            <div className={classNames('form-group', {'has-error': field && field.touched && field.error})}>
                {label && <label className="control-label">{label}</label>}
                <div>
                    <Picker selected={value} onChange={this.onChange} />
                </div>
                {field && field.touched && field.error && <div className="text-error help-block sm">{field.error}</div>}
            </div>
        )
    }
}