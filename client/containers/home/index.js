import React from 'react';
import {connect} from 'react-redux';
import autobind from 'autobind-decorator';


import { createToast } from '../../redux/modules/toast';

@connect(state=>state)
export default class Home extends React.Component {
    @autobind
    handleAction(e, action) {
        const id = e._id;
        const {dispatch, session: {user}} = this.props;
        switch (action) {
            case 'cancel':
                return dispatch(cancelRequest(id));
            case 'end':
                return dispatch(endSession(id, e.endToken));
            case 'start':
                return dispatch(startSession(id, user._id));
            case 'request-end':
                return dispatch(requestEnd(id)).then(
                    () => dispatch(createToast('Request sent'))
                );
            case 'reject':
                return dispatch(rejectRequest(id));
        }

    }

    render() {
        const { session: {user}}  = this.props;
        const role = user.role;
        return <h1>hello</h1>
    }
}