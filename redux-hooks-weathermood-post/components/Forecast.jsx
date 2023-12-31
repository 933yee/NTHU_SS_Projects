import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import WeatherDisplay from 'components/WeatherDisplay.jsx';
import WeatherTable from 'components/WeatherTable.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import { cancelForecast } from 'api/open-weather-map.js';
import { getForecast } from 'states/weather-actions.js';

import './Forecast.css';

function Forecast(props) {
  const { unit, city, list, masking, forecastLoading } = props;
  const tomorrow = list[0];
  const rests = list.slice(1);

  const { inputValue } = useSelector((state) => state.weatherForm);

  useEffect(() => {
    props.dispatch(getForecast(inputValue ? inputValue : 'Hsinchu', unit));
    return () => {
      if (forecastLoading) {
        cancelForecast();
      }
    };
  }, [props.unit]);

  document.body.className = `weather-bg ${tomorrow.group}`;
  document.querySelector('.weather-bg .mask').className = `mask ${masking ? 'masking' : ''}`;

  return (
    <div className='forecast'>
      <div className='tomorrow'>
        <WeatherForm city={city} defaultUnit={unit} submitAction={getForecast} />
        <WeatherDisplay {...tomorrow} day='tomorrow' unit={unit} masking={masking} />
      </div>
      <div className='rests'>
        <WeatherTable list={rests} unit={unit} masking={masking} />
      </div>
    </div>
  );
}

Forecast.propTypes = {
  city: PropTypes.string,
  list: PropTypes.array,
  forecastLoading: PropTypes.bool,
  masking: PropTypes.bool,
  unit: PropTypes.string,
};

export default connect((state) => {
  return {
    ...state.forecast,
    unit: state.unit,
  };
})(Forecast);