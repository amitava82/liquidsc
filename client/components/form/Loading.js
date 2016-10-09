/**
 * Created by amitava on 20/02/16.
 */
import React from 'react';

export default class Loading extends React.Component {
    render(){
        return (
            <div className="loading">
                <i className="fa fa-circle-o-notch fa-spin" />
            </div>
        )
    }
}