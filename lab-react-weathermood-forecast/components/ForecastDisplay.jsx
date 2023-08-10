import React from 'react';
import PropTypes from 'prop-types';

import './ForecastDisplay.css';
// import './owfont-regular';

export default class WeatherDisplayForecast extends React.Component {
    static propTypes = {
        masking: PropTypes.bool,
        group: PropTypes.string,
        description: PropTypes.string,
        temp: PropTypes.number,
        unit: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={`weather-display ${this.props.masking
                ? 'masking'
                : ''}`}>
                {/* <img src={`images/w-${this.props.group}.png`} /> */}
                {this.props.sub ? <i className={`owf owf-${this.props.code} owf-5x`}></i> : <img src={`images/w-${this.props.group}.png`} />}

                <p className='day-of-week'>{this.props.dayOfWeek}</p>

                {this.props.sub ?

                    <p className='description-small'>{this.props.group}</p>
                    :
                    <p className='description'>{this.props.group}</p>
                }
                &nbsp;
                <h1 className='temp'>
                    {this.props.sub ?

                        <span className='small-weather-temp'>{this.props.temp.toFixed(0)}&ordm;</span>
                        :
                        <span className='normal-weather-temp'>{this.props.temp.toFixed(0)}&ordm;</span>
                    }
                    &nbsp;
                    {this.props.sub ?

                        <p className='small-weather-unit'>{(this.props.unit === 'metric') ? 'C' : 'F'}</p>
                        :
                        <p className='normal-weather-unit'>{(this.props.unit === 'metric') ? 'C' : 'F'}</p>
                    }

                </h1>
            </div>
        );
    }
}
