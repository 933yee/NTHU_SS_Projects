import React from 'react';
import PropTypes from 'prop-types';
import {
    Tooltip
} from 'reactstrap';
import moment from 'moment';

import {getMoodUrl} from 'utilities/mood.js';

import './PostItem.css';

export default class MoodItem extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        mood: PropTypes.string,
        text: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {id, mood, text, ts,} = this.props;
        return (
            <div className='mood'><i className={getMoodIcon(mood)}></i></div>
        );
    }
}
