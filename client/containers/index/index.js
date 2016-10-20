import React from 'react';
import { Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router';



export default class Index extends React.Component {
    render() {

        const bs = (
            <Carousel controls={false}>
                <Carousel.Item>
                    <Carousel.Caption>
                        <h1>Supply Chain Financing Platform</h1>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Carousel.Caption>
                        <h1>Competitive & transparent Loan Pricing via Loan bidding</h1>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <Carousel.Caption>
                        <h1>Access to Asset Backed lending opportunities</h1>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        );

        return (
            <div>
                <div>
                    {bs}
                </div>
                <div className="container">
                    <Row className="flex">
                        <Col sm={4}>
                            <div className=" home-card">
                                <h3 className="text-center">BUYER</h3>
                                <div className="flex-item">
                                    <div>Extend Payable days and improve WCR.</div>
                                    <div>Improve supplier relationships by ensuring supplier ‘liquidity’.</div>
                                    <div>Enhance cash flows and profitability.</div>
                                </div>
                                <div className="text-center">
                                    <Link className="btn btn-primary btn-lg" to="/signup">Register</Link>
                                </div>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="home-card">
                                <h3 className="text-center">SUPPLIER</h3>
                                <div className="flex-item">
                                    <div>Reduce cost of financing & optimize working capital cycle</div>
                                    <div>Leverage pooled assets for improving profitability.</div>
                                    <div>Unlock liquidity & enhance cashflows.</div>
                                </div>
                                <div className="text-center">
                                    <Link className="btn btn-primary btn-lg" to="/signup">Register</Link>
                                </div>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="home-card">
                                <h3 className="text-center">LENDER</h3>
                                <div className="flex-item">
                                    <div>Access to Asset Backed( i.e. Receivables) lending opportunities.</div>
                                    <div>Opportunity to earn high yields.</div>
                                    <div>Flexibility to diversify risk through investing in pooled receivables.</div>
                                    <div>*lending to businesses is subject to risk and only permitted for Accredited Investors.</div>
                                </div>
                                <div className="text-center">
                                    <Link className="btn btn-primary btn-lg" to="/signup">Register</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <br/>
                </div>
            </div>
        )
    }
}