import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
    Alert,
    Input,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { connect, useDispatch } from 'react-redux';
import { useState } from 'react';
import { getMoodIcon } from 'utilities/weather.js';
import {
    createPost,
    input,
    inputDanger,
    toggleMood,
    setMoodToggle,
    selectMood
} from 'states/post-actions.js';

import './PostForm.css';

function PostForm(props) {
    const inputEl = useRef(null);

    // TODO
    const dispatch = useDispatch();

    // 最下面的 connect 會把 state.postForm 連到這邊的 props (應該吧
    const { moodToggle, mood, inputValue } = props;

    // 是否有輸入東西
    const [inputDangerClass, setInputDangerClass] = useState('');

    // 左邊下拉選單偵測
    const handleMoodToggle = () => {
        dispatch(toggleMood());
    };

    // 左邊下拉選單選擇某 mood 後
    const handleDropdownSelect = (selectedMood) => {
        dispatch(selectMood(selectedMood));
    };

    const handleInputChange = (e) => {
        // 偵測輸入
        dispatch(input(e.target.value));

        // 取消框框變紅
        dispatch(inputDanger(false));
        setInputDangerClass('')
    };

    const handlePost = () => {
        // 如果沒選mood，左邊選單會跳出來
        if (mood == 'na') {
            dispatch(setMoodToggle(true));
        }
        // 如果 input 是空的，變成紅色
        else if (inputValue == '') {
            dispatch(inputDanger(true));
            setInputDangerClass('form-control is-invalid');
            // 原本應為在 <Alert> 裡的 has-danger class (bootstrap內建的)
            // 但 has-danger 好像被砍了，所以我改成在 <Input> 裡面的 form-control is-invalid class，
            // 但這樣會改到助教給的 code 
        }
        // 如果都沒問題，創建post
        else {
            dispatch(inputDanger(false));
            setInputDangerClass('')
            dispatch(createPost(mood, inputValue));
            console.log("you create a post");

            // reset
            dispatch(input(''));
            dispatch(selectMood('na'));
        }
    };
    //上面新加的

    return (
        <div className="post-form">
            <Alert color='info' className={`d-flex flex-column flex-sm-row justify-content-center`}>
                <div className='mood align-self-start'>
                    <ButtonDropdown type='buttom' isOpen={moodToggle} toggle={handleMoodToggle}>
                        <DropdownToggle className='mood-toggle' type='button' caret color="secondary">
                            <i className={getMoodIcon(mood)}></i>&nbsp;{
                                mood === 'na' ? 'Mood' : mood
                            }
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Clear')}><i className={getMoodIcon('Clear')}></i>&nbsp;&nbsp;Clear</DropdownItem>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Clouds')}><i className={getMoodIcon('Clouds')}></i>&nbsp;&nbsp;Clouds</DropdownItem>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Drizzle')}><i className={getMoodIcon('Drizzle')}></i>&nbsp;&nbsp;Drizzle</DropdownItem>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Rain')}><i className={getMoodIcon('Rain')}></i>&nbsp;&nbsp;Rain</DropdownItem>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Thunder')}><i className={getMoodIcon('Thunder')}></i>&nbsp;&nbsp;Thunder</DropdownItem>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Snow')}><i className={getMoodIcon('Snow')}></i>&nbsp;&nbsp;Snow</DropdownItem>
                            <DropdownItem type='button' onClick={() => handleDropdownSelect('Windy')}><i className={getMoodIcon('Windy')}></i>&nbsp;&nbsp;Windy</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
                <Input className={`input ${inputDangerClass}`} type='textarea' innerRef={inputEl} value={inputValue} onChange={handleInputChange} placeholder="What's on your mind?"></Input>
                <Button className='btn-post align-self-end' color="info" onClick={handlePost}>Post</Button>
            </Alert>
        </div>
    );
};

PostForm.propTypes = {
    inputValue: PropTypes.string,
    inputDanger: PropTypes.bool,
    moodToggle: PropTypes.bool,
    mood: PropTypes.string,
    dispatch: PropTypes.func,
};

export default connect((state) => {
    // TODO
    return {
        ...state.postForm
    }
})(PostForm);