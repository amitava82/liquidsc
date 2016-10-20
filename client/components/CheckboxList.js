/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import autobind from 'autobind-decorator';
import map from 'lodash/map';
import indexOf from 'lodash/indexOf';

export default class CheckboxList extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            items: []
        }
    }

    getChecked() {
        const list = this.refs.list;
        var children = [].slice.call(list.querySelectorAll('input'), 0);
        var vals = children.reduce(function (memo, child) {
            if (child.checked) {
                memo.push(child.value)
            }
            return memo
        }, []);

        return vals;
    }

    @autobind
    onChange(e) {
        const vals = this.getChecked();
        this.props.onChange(vals);
    }

    @autobind
    checkAll() {
        this.props.onChange(map(this.props.options, this.props.valueKey));
    }

    @autobind
    uncheckAll() {
        this.props.onChange([]);
    }

    render() {
        const {options, valueKey, labelKey, value} = this.props;


        const items = options.map((i, idx) => (
            <li key={idx}>
                <label>
                    <input
                        onChange={this.onChange}
                        type="checkbox"
                        checked={indexOf(value, i[valueKey]) > -1}
                        value={i[valueKey]}/> {i[labelKey]}
                </label>
            </li>
        ));

        return (
            <div className="checkbox-list">
                <button onClick={this.checkAll} className="btn btn-link btn-sm">Check all</button>
                {' '}
                <button onClick={this.uncheckAll} className="btn btn-link btn-sm">Uncheck all</button>
                <ul className="list-unstyled" ref="list">
                    {items}
                </ul>
            </div>
        )
    }
}