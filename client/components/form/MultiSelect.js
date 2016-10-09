import React from 'react';
import Select from 'react-select';
import extend from 'lodash/extend';
import map from 'lodash/map';

export default class MultiSelect extends React.Component{

    onChange(vals){
        this.props.field.onChange(map(vals, this.props.valueKey))
    }

    render(){
        const { options = [], field, className, placeholder, labelKey, valueKey} = this.props;
        return (
            <Select
                multi={true}
                value={field.value}
                options={options}
                onChange={::this.onChange}
                className={className}
                labelKey={labelKey}
                valueKey={valueKey}
                placeholder={placeholder}
            />
        )
    }
}