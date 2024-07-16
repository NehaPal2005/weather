const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='d50b07900d6409787e2ba4604b564505';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        const {longitude: lon, latitude: lat} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`).then(res => res.json()).then(data1 => {

        console.log(data1)
        showData(data1);
        })

    })
}

function showWeatherData (data){
    let {humidity, pressure} = data.main;
    let {sunrise, sunset} = data.sys;
    let {speed}=data.wind;

    timezone.innerHTML = data.name;
    countryEl.innerHTML = data.coord.lat + 'N ' + data.coord.lon+'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    
    
    `;
    const todayForecast = data.main;
        currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${todayForecast.weather[0].icon}@2x.png" 
                alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(todayForecast.dt * 1000).format('dddd')}</div>
                <div class="temp">Night - ${(todayForecast.temp_min-273.15).toFixed(2)}&#176;C</div>
                <div class="temp">Day - ${(todayForecast.temp_max-273.15).toFixed(2)}&#176;C</div>
            </div>
        `;

}
function showData(data1){
    
    
        // Iterate through remaining days for forecast
        let otherDayForecast = '';
let previousDay = ''; // Track the previous day

for (let i = 1; i < data1.list.length; i++) {
    const dayForecast = data1.list[i];
    const currentDay = window.moment(dayForecast.dt * 1000).format('ddd');
    const tempMinCelsius = (dayForecast.main.temp_min - 273.15).toFixed(2); // Convert min temp
    const tempMaxCelsius = (dayForecast.main.temp_max - 273.15).toFixed(2); // Convert max temp


    // Check if current day is the same as previous day
    if (currentDay !== previousDay) {
        otherDayForecast += `
            <div class="weather-forecast-item">
                <div class="day">${currentDay}</div>
                <img src="http://openweathermap.org/img/wn/${dayForecast.weather[0].icon}.png"
                    alt="weather icon" class="w-icon">
                <div class="temp">Night - ${tempMinCelsius}&#176;C</div>
                <div class="temp">Day - ${tempMaxCelsius}&#176;C</div>
            </div>
        `;
    }

    // Update previousDay to currentDay for the next iteration
    previousDay = currentDay;
}

        


    weatherForecastEl.innerHTML = otherDayForecast;
}