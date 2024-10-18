const apiKey = 'b9c8aac403f16628beacd26b45cd892c';
const body = document.getElementById('body');
//some inspiration is taken from "https://blog.weatherstack.com/blog/building-a-simple-javascript-weather-app-using-weatherstack/"//
document.addEventListener("DOMContentLoaded", function () {
    displayFavorites();
    applySavedDarkMode();
});
//implementing dark mode was difficult for me so I used chatgpt for that//
async function getWeather() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            displayWeather(data, unit);
            changeThemeBasedOnWeather(data.weather[0].main);
        } else {
            alert('City not found.');
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}
//used help from chatgpt and "https://www.codingnepalweb.com/build-weather-app-html-css-javascript/"//
function displayWeather(data, unit) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleString();
    const tempUnitSymbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K'; // Determine the symbol
    document.getElementById('temperature').textContent = `${data.main.temp} ${tempUnitSymbol}`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('wind-speed').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

async function get24HourForecast() {
    const city = document.getElementById('city-input').value || 'Stockholm';
    const unit = document.getElementById('temp-unit').value; 
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}&cnt=8`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
            display24HourForecast(data.list, unit);
        } else {
            alert('Error fetching forecast.');
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function display24HourForecast(forecast, unit) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; 
//got help from chatgpt//
    forecast.forEach((hourData, index) => {
        const hourElem = document.createElement('p');
        const time = new Date(hourData.dt_txt).getHours();
        let message = '';

        if (time >= 6 && time < 12) {
            message = 'Have coffee!';
        } else if (time >= 12 && time < 18) {
            message = 'More coffee!';
        } else if (time >= 18 && time < 21) {
            message = 'Sunset and coffee?';
        } else {
            message = 'Dark mode activated.';
        }

        const tempUnitSymbol = unit === 'metric' ? '°C' : unit === 'imperial' ? '°F' : 'K'; 
        hourElem.textContent = `${time}:00 - ${hourData.main.temp} ${tempUnitSymbol}, ${hourData.weather[0].description} - ${message}`;
        forecastDiv.appendChild(hourElem);
    });

    document.getElementById('forecast-info').style.display = 'block';
}

function addFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }
    displayFavorites();
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    const favoriteCitiesElem = document.getElementById('favorite-cities');
    favoriteCitiesElem.innerHTML = ''; 

    favorites.forEach(city => {
        const cityElem = document.createElement('li');
        cityElem.textContent = city;
        favoriteCitiesElem.appendChild(cityElem);
    });
}

//dark mode was inpired from chatgpt and some youtube video//
function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeToggle').checked;
    if (isDarkMode) {
        body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
}

function applySavedDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
}

// used chatgpt here and some youtube video//
function changeThemeBasedOnWeather(weather) {
    if (weather === 'Clear') {
        body.style.backgroundColor = '#87CEEB'; 
    } else if (weather === 'Clouds') {
        body.style.backgroundColor = '#B0C4DE'; 
    } else if (weather === 'Rain' || weather === 'Drizzle') {
        body.style.backgroundColor = '#708090'; 
    } else if (weather === 'Snow') {
        body.style.backgroundColor = '#F0FFFF'; 
    } else {
        body.style.backgroundColor = '#D3D3D3'; 
    }
}
