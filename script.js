const apiKey = 'b9c8aac403f16628beacd26b45cd892c'; 
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
let favorites = [];

document.getElementById('city-input-btn').addEventListener('click', () => {
    let cityName = document.getElementById('city-input').value || 'Stockholm';
    getWeather(cityName);
});

document.querySelectorAll('input[name="unit"]').forEach(input => {
    input.addEventListener('change', () => {
        let cityName = document.getElementById('city-name').textContent || 'Stockholm';
        getWeather(cityName);
    });
});

document.getElementById('favorite-btn').addEventListener('click', () => {
    let cityName = document.getElementById('city-name').textContent;
    if (cityName && !favorites.includes(cityName)) {
        favorites.push(cityName);
        updateFavoritesMenu();
    }
});

document.getElementById('favorites-menu').addEventListener('change', () => {
    let selectedCity = document.getElementById('favorites-menu').value;
    if (selectedCity) {
        getWeather(selectedCity);
    }
});

async function getWeather(city) {
    const unit = document.querySelector('input[name="unit"]:checked').value;
    try {
        const res = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=${unit}`);
        const data = await res.json();
        if (res.ok) {
            displayWeather(data);
        } else {
            alert('City not found, try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch weather data.');
    }
}

function displayWeather(data) {
    const currentHour = new Date().getHours();
    const weatherInfo = document.getElementById('weather-info');
    
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = `${data.main.temp}°`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('wind-speed').textContent = `Wind: ${data.wind.speed} m/s`;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    document.getElementById('date').textContent = new Date().toLocaleString();

    updateMessageAndTheme(currentHour);

    weatherInfo.style.display = 'block';
}

function updateMessageAndTheme(hour) {
    const body = document.body;
    const message = document.getElementById('message');
    if (hour >= 6 && hour < 12) {
        message.textContent = 'Have coffee';
        body.classList.remove('night');
    } else if (hour >= 12 && hour < 18) {
        message.textContent = 'Must have been a long day, more coffee';
        body.style.background = '#FFB74D'; // Afternoon orange
    } else if (hour >= 18 && hour < 21) {
        message.textContent = 'Sunset and coffee?';
        body.style.background = '#FF7043'; // Sunset theme
    } else {
        message.textContent = 'Night time, dark mode activated';
        body.classList.add('night');
    }
}

function updateFavoritesMenu() {
    const menu = document.getElementById('favorites-menu');
    menu.innerHTML = '<option value="">Select Favorite</option>';
    favorites.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        menu.appendChild(option);
    });
}

// Fetch Stockholm weather initially
getWeather('Stockholm');