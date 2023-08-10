import React from 'react';
import PropTypes from 'prop-types';
import {Alert} from 'reactstrap';

import WeatherDisplay from 'components/WeatherDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import PostForm from 'components/PostForm.jsx';
import PostList from 'components/PostList.jsx';
import FaceSelectionModal from 'components/FaceSelectionModal.jsx';
import {getWeather, cancelWeather} from 'api/open-weather-map.js';
import {listPosts, createPost, createVote} from 'api/posts.js';
import {getMoodUrl} from 'utilities/mood.js';

import './Today.css';

export default class Today extends React.Component {
    static propTypes = {
        unit: PropTypes.string,
        searchText: PropTypes.string,
        onUnitChange: PropTypes.func
    };

    static getInitWeatherState() {
        return {
            city: 'na',
            code: -1,
            group: 'na',
            description: 'N/A',
            temp: NaN
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Today.getInitWeatherState(),
            weatherLoading: false,
            masking: false,
            postLoading: false,
            posts: [],
            showModal: false,
            predicting: false,
            faceImgUrls: {
                Default: getMoodUrl(), 
                Fear: getMoodUrl('Sad'),
                Happy: getMoodUrl('Happy'), 
                Sad: getMoodUrl('Fear')
            }
        };

        this.handleWeatherQuery = this.handleWeatherQuery.bind(this);
        this.handleCreatePost = this.handleCreatePost.bind(this);
        this.handleCreateVote = this.handleCreateVote.bind(this);
        this.changeFaceFile = this.changeFaceFile.bind(this);
        this.changeFaceImgUrls = this.changeFaceImgUrls.bind(this);
        this.setPredicting = this.setPredicting.bind(this);
    }

    componentDidMount() {
        this.getWeather('Hsinchu', this.props.unit);
        this.listPosts(this.props.searchText);
    }

    componentWillUnmount() {
        if (this.state.weatherLoading) {
            cancelWeather();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchText !== this.props.searchText) {
            this.listPosts(nextProps.searchText);
        }
    }

    render() {
        const {unit} = this.props;
        const {group, city, masking, posts, postLoading, predicting} = this.state;

        document.body.className = `weather-bg ${group}`;
        document.querySelector('.weather-bg .mask').className = `mask ${masking ? 'masking' : ''}`;

        return (
            <div className='today'>
                <div className='weather'>
                    <WeatherForm city={city} unit={unit} onQuery={this.handleWeatherQuery}/>
                    <WeatherDisplay {...this.state} day='today'/>
                </div>
                <div className='posts'>
                    <PostForm onPost={this.handleCreatePost} />
                    <PostList posts={posts} onVote={this.handleCreateVote} changeFaceFile={this.changeFaceFile} faceImgUrls={this.state.faceImgUrls}/>{
                        postLoading &&
                        <Alert color='warning' className='loading'>Loading...</Alert>
                    }
                    {
                        predicting &&
                        <Alert color='warning' className='loading'>Predicting...</Alert>

                    }
                </div>
                <FaceSelectionModal showModal={this.state.showModal} changeFaceImgUrls={this.changeFaceImgUrls}
                     changeFaceFile={this.changeFaceFile} setPredicting={this.setPredicting} ></FaceSelectionModal>
            </div>
        );
    }

    getWeather(city, unit) {
        this.setState({
            weatherLoading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getWeather(city, unit).then(weather => {
                this.setState({
                    ...weather,
                    weatherLoading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Today.getInitWeatherState(unit),
                    weatherLoading: false
                }, () => this.notifyUnitChange(unit));
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    listPosts(searchText) {
        this.setState({
            postLoading: true
        }, () => {
            listPosts(searchText).then(posts => {
                this.setState({
                    posts,
                    postLoading: false
                });
            }).catch(err => {
                console.error('Error listing posts', err);

                this.setState({
                    posts: [],
                    postLoading: false
                });
            });
        });
    }

    handleWeatherQuery(city, unit) {
        this.getWeather(city, unit);
    }

    notifyUnitChange(unit) {
        if (this.props.units !== unit) {
            this.props.onUnitChange(unit);
        }
    }

    handleCreatePost(mood, text) {
        createPost(mood, text).then(() => {
            this.listPosts(this.props.searchText);
        }).catch(err => {
            console.error('Error creating posts', err);
        });
    }

    handleCreateVote(id, mood) {
        createVote(id, mood).then(() => {
            this.listPosts(this.props.searchText);
        }).catch(err => {
            console.error('Error creating vote', err);
        });
    }

    changeFaceFile() {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    changeFaceImgUrls(urls) {
        this.setState({
            faceImgUrls: urls,
            predicting: false
        })
    }

    setPredicting(flag) {
        this.setState({
            predicting: flag
        })
    }
}
