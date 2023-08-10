import React from 'react';
import PropTypes from 'prop-types';
import {
    Tooltip
} from 'reactstrap';
import moment from 'moment';

import { getMoodIcon } from 'utilities/mood.js';

import './PostItem.css';

export default class PostItem extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        mood: PropTypes.string,
        text: PropTypes.string,
    };

    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        // this.handleTooltipToggle = this.handleTooltipToggle.bind(this);
        // this.handleVote = this.handleVote.bind(this);
    }

    render() {
        const { id, mood, text, ts, } = this.props;
        return (
            <div className='post-item d-flex flex-column'>
                <div className='post d-flex'>
                    <div className='wrap'>
                        <div className='ts'>{moment(ts * 1000).calendar()}</div>
                        <div className='text'>{text}</div>
                    </div>
                    <div className='mood'><i className={getMoodIcon(mood)}></i></div>
                </div>
            </div>
        );
    }
}
