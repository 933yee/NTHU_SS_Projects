import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './PostItem.css';

export default class PostItem extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        mood: PropTypes.string,
        text: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {id, mood, text, ts, faceImgUrls} = this.props;
        return (
            <div className='post-item d-flex flex-column'>
                <div className='post d-flex'>
                    <div className='wrap'>
                        <div className='ts'>{moment(ts * 1000).calendar()}</div>
                        <div className='text'>{text}</div>
                    </div>
                    <div onClick={this.props.changeFaceFile} className='mood'>
                        <img className={"mood-img"} width={"60px"} src={faceImgUrls[mood]} style={{cursor: "pointer"}}></img>
                    </div>
                </div>
            </div>
        );
    }
}
