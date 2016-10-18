/**
 * Created by amita on 10/10/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import Select from 'react-select';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import UIDate from '../../../components/UIDate';

export default class DetailsSection extends React.Component {

    render() {
        const {data} = this.props;

        const docs = data.documents.map(doc => <div><a target="_blank" href={`/api/applications/${data._id}/docs/${doc.fieldname}`}>{doc.fieldname}</a> </div>);

        return (
            <Col md={9}>
                <h4>Details</h4>
                <Row>
                    <Col xs={6}>
                        <dl className="dl-horizontal">
                            <dt>ID</dt>
                            <dd>{data._id}</dd>
                            <dt>Created</dt>
                            <dd><UIDate date={data.createdAt}/></dd>
                            <dt>Updated</dt>
                            <dd><UIDate date={data.updatedAt}/></dd>
                            <dt>Loan Amount</dt>
                            <dd>{data.loanAmount}</dd>
                            <dt>Tenor</dt>
                            <dd>{data.tenor} days</dd>
                            <dt>Interest %</dt>
                            <dd>{data.rateOfInterest}</dd>
                            <dt>Receivable date</dt>
                            <dd><UIDate date={data.receivableDate}/></dd>
                            <dt> RECEIVABLE STATUS</dt>
                            <dd className="capitalize">{data.receivableStatus}</dd>
                            <dt>ALCH status</dt>
                            <dd className="capitalize">{data.status}</dd>
                            <dt>Loan account</dt>
                            <dd>{data.account && <Link to={`/admin/accounts/${data.account}`}>Account</Link>}</dd>
                        </dl>
                    </Col>
                    <Col xs={6}>
                        <dl className="dl-horizontal">
                            <dt>Borrower</dt>
                            <dd>{data.company.company}</dd>
                            <dt>Buyer company</dt>
                            <dd>{data.buyer ? data.buyer.company : data.buyerEmail}</dd>
                            <dt>Buyer contact person</dt>
                            <dd>{data.buyerContactPerson}</dd>
                            <dt>Export company</dt>
                            <dd>{data.isExporter ? 'YES' : 'NO'}</dd>

                        </dl>
                    </Col>
                </Row>
                <h4>Documents</h4>
                {docs}
                {this.props.children}
            </Col>
        )
    }
}