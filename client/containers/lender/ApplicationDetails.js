/**
 * Created by amita on 10/11/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';
import { Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';

import DetailsSection from '../application/components/DetailsSection';

import { getApplication } from '../../redux/modules/applications';

@connect(state => state)
export default class ApplicationDetails extends React.Component {

    componentWillMount() {
        this.props.dispatch(getApplication(this.props.params.id));
    }

    render() {
        const {applications: {viewing}} = this.props;

        if(!viewing) return <h5>Loading...</h5>;

        return (
            <div>
                <h3>Application details</h3>
                <Row>
                    <DetailsSection data={viewing} />
                </Row>
            </div>
        )
    }
}