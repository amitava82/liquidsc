import React from 'react';
import {Link} from 'react-router';
import { Row, Col } from 'react-bootstrap';

export default class Footer extends React.Component {
    render (){
        return (
            <footer>
                <div className="container text-center">
                    <Col xs={12}>
                        <div className="footer-links">
                            <a href="/privacy">Privacy Policy</a>
                            <a href="mailto:support@alchcapital.com">Support</a>
                            <a href="">LinkedIn</a>
                            <a href="">Twitter</a>
                        </div>
                    </Col>
                    <br/>
                    <p>Copyright &copy; {new Date().getFullYear()} liquidSC</p>
                </div>
            </footer>
        )
    }
}