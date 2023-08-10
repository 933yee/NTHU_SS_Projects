import axios from 'axios';

// TODO replace the key with yours
const key = '';
const baseUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${key}`;
const baseUrlForecast = `http://api.openweathermap.org/data/2.5/forecast?appid=${key}`;

export function getWeatherGroup(code) {
    let group = 'na';
    if (200 <= code && code < 300) {
        group = 'thunderstorm';
    } else if (300 <= code && code < 400) {
        group = 'drizzle';
    } else if (500 <= code && code < 600) {
        group = 'rain';
    } else if (600 <= code && code < 700) {
        group = 'snow';
    } else if (700 <= code && code < 800) {
        group = 'atmosphere';
    } else if (800 === code) {
        group = 'clear';
    } else if (801 <= code && code < 900) {
        group = 'clouds';
    }
    return group;
}

export function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
}

let weatherSource = axios.CancelToken.source();

export function getWeather(city, unit, lat, lon) {
    var url = `${baseUrl}&q=${encodeURIComponent(city)}&units=${unit}`;
    var urlCoord = `${baseUrl}&lat=${lat}&lon=${lon}&units=${unit}`;
    url = city == '' ? urlCoord : url;
    // console.log(`Making request to: ${url}`);
    console.log(urlCoord);
    return axios.get(url, { cancelToken: weatherSource.token }).then(function (res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            return {
                city: capitalize(city),
                code: res.data.weather[0].id,
                group: getWeatherGroup(res.data.weather[0].id),
                description: res.data.weather[0].description,
                temp: res.data.main.temp,
                unit: unit, // or 'imperial'
            };
        }
    }).catch(function (err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}

export function cancelWeather() {
    weatherSource.cancel('Request canceled');
}

export function getWeatherForecast(city, unit, day, lat, lon) {
    var url = `${baseUrlForecast}&q=${encodeURIComponent(city)}&units=${unit}`;
    var urlCoord = `${baseUrlForecast}&lat=${lat}&lon=${lon}&units=${unit}`;
    url = city == '' ? urlCoord : url;
    console.log(`Making request to: ${url}`);

    return axios.get(url, { cancelToken: weatherSource.token }).then(function (res) {
        if (res.data.cod && res.data.message) {
            throw new Error(res.data.message);
        } else {
            day = (day - 1) * 8 + 3;
            const daySeed = 1681257600;
            const dayOfWeekSeed = 3;
            let dayOfWeekList = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'];
            let dayDiff = Math.floor((res.data.list[day].dt - daySeed) / 86400);
            let calcDay = (dayOfWeekSeed + dayDiff) % 7;
            let dayOfWeek = dayOfWeekList[calcDay];
            return {
                city: capitalize(city),
                code: res.data.list[day].weather[0].id,
                group: getWeatherGroup(res.data.list[0].weather[0].id),
                description: res.data.list[day].weather[0].description,
                temp: res.data.list[day].main.temp,
                unit: unit, // or 'imperial'
                dayOfWeek: dayOfWeek
            };
        }
    }).catch(function (err) {
        if (axios.isCancel(err)) {
            console.error(err.message, err);
        } else {
            throw err;
        }
    });
}