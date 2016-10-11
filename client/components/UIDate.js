/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import moment from 'moment';

export default function (props) {
    const date = props.date;
    if(!date) return null;

    return (
        <span>{moment(date).format('DD-MM-YYYY h:m a')}</span>
    )
}