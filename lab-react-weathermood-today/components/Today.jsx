import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import WeatherDisplay from 'components/WeatherDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import { getWeather } from 'api/open-weather-map.js';

import './weather.css';

export default class Today extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        temp: PropTypes.number,
        unit: PropTypes.string
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
            loading: true,
            masking: true
        };

        this.handleFormQuery = this.handleFormQuery.bind(this);
    }

    async getLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    async componentDidMount() {
        try {
            const position = await this.getLocation();
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            this.getWeather('', this.props.unit, lat, lon);
        } catch (error) {
            console.error(error);
            this.getWeather('Taipei', this.props.unit);
        }
        // .then(res => { console.log(res) });

    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }

    render() {
        return (
            <div className={`today weather-bg ${this.state.group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <WeatherDisplay {...this.state} />
                    <WeatherForm city={this.state.city} unit={this.props.unit} onQuery={this.handleFormQuery} />
                </div>
            </div>
        );
    }

    getWeather(city, unit, lat, lon) {
        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getWeather(city, unit, lat, lon).then(weather => {
                this.setState({
                    ...weather,
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Today.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
        });

        setTimeout(() => {
            this.setState({
                masking: false
            });
        }, 600);
    }

    handleFormQuery(city, unit) {
        this.getWeather(city, unit);
    }

    notifyUnitChange(unit) {

        if (this.props.unit !== unit) {
            this.props.onUnitChange(unit);
        }
    }
}
