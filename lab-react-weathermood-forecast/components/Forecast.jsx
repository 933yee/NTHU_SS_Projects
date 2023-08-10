import React from 'react';
import PropTypes from 'prop-types';

import WeatherDisplayForecast from 'components/ForecastDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import { getWeatherForecast } from 'api/open-weather-map.js';

import './weather.css';

export default class Forecast extends React.Component {
    // static propTypes = {
    //     masking: PropTypes.bool,
    //     group: PropTypes.string,
    //     description: PropTypes.string,
    //     temp: PropTypes.number,
    //     unit: PropTypes.string
    // };

    static getInitWeatherState() {
        return {
            day1: {
                city: 'na',
                code: -1,
                group: 'na',
                description: 'N/A',
                temp: NaN,
            },
            day2: {
                city: 'na',
                code: -1,
                group: 'na',
                description: 'N/A',
                temp: NaN,
            },
            day3: {
                city: 'na',
                code: -1,
                group: 'na',
                description: 'N/A',
                temp: NaN,
            },
            day4: {
                city: 'na',
                code: -1,
                group: 'na',
                description: 'N/A',
                temp: NaN,
            },
            day5: {
                city: 'na',
                code: -1,
                group: 'na',
                description: 'N/A',
                temp: NaN,
            },
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            ...Forecast.getInitWeatherState(),
            loading: true,
            masking: true
        };

        this.handleFormQuery = this.handleFormQuery.bind(this);
    }

    componentDidMount() {
        this.getWeatherForecast('Hsinchu', this.props.unit);
    }

    componentWillUnmount() {
        if (this.state.loading) {
            cancelWeather();
        }
    }

    render() {
        return (
            <div className={`today weather-bg ${this.state.day1.group}`}>
                <div className={`mask ${this.state.masking ? 'masking' : ''}`}>
                    <WeatherForm city={this.state.city} unit={this.props.unit} onQuery={this.handleFormQuery} />

                    <WeatherDisplayForecast {...this.state.day1} />
                    <div className='row container-fluid d-flex justify-content-center'>
                        <div className="">
                            <WeatherDisplayForecast {...this.state.day2} sub={true} />
                        </div>
                        <div className="d-none d-sm-block">
                            <WeatherDisplayForecast {...this.state.day3} sub={true} />
                        </div>
                        <div className="d-none d-md-block">
                            <WeatherDisplayForecast {...this.state.day4} sub={true} />
                        </div>
                        <div className="d-none d-lg-block">
                            <WeatherDisplayForecast {...this.state.day5} sub={true} />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    getWeatherForecast(city, unit) {
        this.setState({
            loading: true,
            masking: true,
            city: city // set city state immediately to prevent input text (in WeatherForm) from blinking;
        }, () => { // called back after setState completes
            getWeatherForecast(city, unit, 1).then(weather => {
                this.setState({
                    day1: { ...weather },
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
            getWeatherForecast(city, unit, 2).then(weather => {
                this.setState({
                    day2: { ...weather },
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
            getWeatherForecast(city, unit, 3).then(weather => {
                this.setState({
                    day3: { ...weather },
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
            getWeatherForecast(city, unit, 4).then(weather => {
                this.setState({
                    day4: { ...weather },
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
                    loading: false
                }, () => this.notifyUnitChange(unit));
            });
            getWeatherForecast(city, unit, 5).then(weather => {
                this.setState({
                    day5: { ...weather },
                    loading: false
                }, () => this.notifyUnitChange(unit));
            }).catch(err => {
                console.error('Error getting weather', err);

                this.setState({
                    ...Forecast.getInitWeatherState(unit),
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
        this.getWeatherForecast(city, unit);
    }

    notifyUnitChange(unit) {
        if (this.props.unit !== unit) {
            this.props.onUnitChange(unit);
        }
    }
}
