/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import moment from 'moment';

export default function (props) {
    const date = props.date;
    const time = props.time;
    if(!date) return null;

    const format = time === false ?  'DD-MM-YYYY' : 'DD-MM-YYYY h:m a';

    return (
        <span>{moment(date).format(format)}</span>
    )
}