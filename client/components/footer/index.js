import React from 'react';
import {Link} from 'react-router';

export default class Footer extends React.Component {
    render (){
        return (
            <footer>
                <p>Copyright &copy; {new Date().getFullYear()} liquidSC</p>
            </footer>
        )
    }
}