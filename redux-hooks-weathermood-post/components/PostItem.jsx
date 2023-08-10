import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import moment from 'moment';
import { getMoodIcon } from 'utilities/weather.js';
import { createVote, setTooltipToggle, toggleTooltip } from 'states/post-actions.js';
import './PostItem.css';

function PostItem(props) {
    //TODO
    const dispatch = useDispatch();
    const { mood, ts, text, clearVotes, cloudsVotes, drizzleVotes, rainVotes, thunderVotes
        , snowVotes, windyVotes, id, tooltipOpen } = props;

    const handleVote = (e) => {
        dispatch(createVote(id, e));
    }

    const handleClick = () => {
        dispatch(setTooltipToggle(id, false));
    }

    const handleTooltipToggle = () => {
        dispatch(toggleTooltip(id));
    }

    return (
        <div className="post-item d-flex flex-column" onClick={handleClick}>
            <div className="post d-flex">
                <div className="mood">
                    <i className={getMoodIcon(mood)}></i>
                </div>
                <div className="wrap">
                    <div className="ts">{moment(ts * 1000).calendar()}</div>
                    <div className="text">{text}</div>
                </div>
            </div>
            <div className="vote d-flex justify-content-end">
                <div className="vote-results">
                    {clearVotes > 0 && (<span><i className={getMoodIcon('Clear')}></i>&nbsp;{clearVotes}&nbsp;&nbsp;</span>)}
                    {cloudsVotes > 0 && <span><i className={getMoodIcon('Clouds')}></i>&nbsp;{cloudsVotes}&nbsp;&nbsp;</span>}
                    {drizzleVotes > 0 && <span><i className={getMoodIcon('Drizzle')}></i>&nbsp;{drizzleVotes}&nbsp;&nbsp;</span>}
                    {rainVotes > 0 && <span><i className={getMoodIcon('Rain')}></i>&nbsp;{rainVotes}&nbsp;&nbsp;</span>}
                    {thunderVotes > 0 && <span><i className={getMoodIcon('Thunder')}></i>&nbsp;{thunderVotes}&nbsp;&nbsp;</span>}
                    {snowVotes > 0 && <span><i className={getMoodIcon('Snow')}></i>&nbsp;{snowVotes}&nbsp;&nbsp;</span>}
                    {windyVotes > 0 && <span><i className={getMoodIcon('Windy')}></i>&nbsp;{windyVotes}&nbsp;&nbsp;</span>}
                </div>
                <div className="vote-plus">
                    <i id={`post-item-vote-${id}`} className="fa fa-plus"></i>
                </div>
            </div>
            <Tooltip placement="left" isOpen={tooltipOpen} autohide={false} target={`post-item-vote-${id}`} toggle={handleTooltipToggle}>
                <i className={`vote-tooltip ${getMoodIcon('Clear')}`} onClick={() => handleVote('Clear')}></i>&nbsp;
                <i className={`vote-tooltip ${getMoodIcon('Clouds')}`} onClick={() => handleVote('Clouds')}></i>&nbsp;
                <i className={`vote-tooltip ${getMoodIcon('Drizzle')}`} onClick={() => handleVote('Drizzle')}></i>&nbsp;
                <i className={`vote-tooltip ${getMoodIcon('Rain')}`} onClick={() => handleVote('Rain')}></i>&nbsp;
                <i className={`vote-tooltip ${getMoodIcon('Thunder')}`} onClick={() => handleVote('Thunder')}></i>&nbsp;
                <i className={`vote-tooltip ${getMoodIcon('Snow')}`} onClick={() => handleVote('Snow')}></i>&nbsp;
                <i className={`vote-tooltip ${getMoodIcon('Windy')}`} onClick={() => handleVote('Windy')}></i>
            </Tooltip>
        </div>
    );
}

PostItem.propTypes = {
    id: PropTypes.string,
    mood: PropTypes.string,
    text: PropTypes.string,
    clearVotes: PropTypes.number,
    cloudsVotes: PropTypes.number,
    drizzleVotes: PropTypes.number,
    rainVotes: PropTypes.number,
    thunderVotes: PropTypes.number,
    snowVotes: PropTypes.number,
    windyVotes: PropTypes.number,
    tooltipOpen: PropTypes.bool,
    dispatch: PropTypes.func,
};

export default connect((state, ownProps) => ({
    tooltipOpen: state.postItem.tooltipOpen[ownProps.id] ? true : false,
}))(PostItem);