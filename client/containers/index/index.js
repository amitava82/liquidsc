import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';

export default class Index extends React.Component {
    render() {
        return (
            <div>
                <div className="hero">
                    <h1>LiquidSC</h1>
                    <h2>Supply Chain Financing Platform</h2>
                </div>
                <br/>
                <Row className="flex">
                    <Col xs={4}>
                        <div className="well text-center home-card">
                            <h2>Buyer</h2>
                            <div className="flex-item">
                                <div>Extend Payable days and improve WCR.</div>
                                <div>Improve supplier relationships by ensuring supplier ‘liquidity’.</div>
                                <div>Enhance cash flows and profitability.</div>
                            </div>
                           <div>
                               <Link className="btn btn-primary btn-lg" to="/signup">Register</Link>
                           </div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="well text-center home-card">
                            <h2>Supplier</h2>
                            <div className="flex-item">
                                <div>Generation of flexible and predictable cash flows.</div>
                                <div>Lower working capital costs.</div>
                                <div>Enhance cash flows and profitability.</div>
                            </div>
                            <div>
                                <Link className="btn btn-primary btn-lg" to="/signup">Register</Link>
                            </div>
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="well text-center home-card">
                            <h2>Lender</h2>
                            <div className="flex-item">
                                <div>Access to Asset Backed( i.e. Receivables) lending opportunities.</div>
                                <div>Opportunity to earn high yields.</div>
                                <div>Flexibility to diversify risk through investing in pooled receivables.</div>
                                <div>*lending to businesses is subject to risk and only permitted for Accredited Investors.</div>
                            </div>
                           <div>
                               <Link className="btn btn-primary btn-lg" to="/signup">Register</Link>
                           </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}