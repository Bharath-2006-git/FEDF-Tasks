const cityInput = document.getElementById('cityInput');
const fetchWeatherBtn = document.getElementById('fetchWeatherBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMsg = document.getElementById('errorMsg');

// Your API key
const API_KEY = '9fa8ffb69ad4c78f946293f4e20c622f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
const getWeather = async (city) => {
    try {
        errorMsg.textContent = ''; // Clear previous errors
        weatherInfo.textContent = 'Loading...';

        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found or API error');
        }

        const data = await response.json();

        // Display weather information
        weatherInfo.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Condition: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

        // Save last searched city to localStorage
        localStorage.setItem('lastCity', city);
    } catch (error) {
        weatherInfo.textContent = '';
        errorMsg.textContent = error.message;
    }
};

// Event listener for button click
fetchWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        errorMsg.textContent = 'Please enter a city name';
    }
});

// Load last searched city on page load
window.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
    }
});
