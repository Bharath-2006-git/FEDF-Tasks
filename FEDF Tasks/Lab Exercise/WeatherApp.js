// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = '9fa8ffb69ad4c78f946293f4e20c622f';
        this.apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
        
        // Add debug logging
        console.log('WeatherApp initializing...');
        
        this.initializeElements();
        this.attachEventListeners();
        this.hideLoading(); // Hide loading initially
        this.loadFromLocalStorage();
        this.loadRecentSearches();
        
        console.log('WeatherApp initialized successfully');
    }

    initializeElements() {
        // Check if all required elements exist
        const requiredElements = [
            'cityInput', 'searchBtn', 'errorMessage', 'loading', 
            'weatherInfo', 'weatherDisplay', 'recentList', 'clearHistory',
            'cityName', 'country', 'temp', 'weatherIcon', 'weatherDescription',
            'feelsLike', 'humidity', 'windSpeed', 'pressure', 'visibility', 
            'cloudiness', 'lastUpdated'
        ];
        
        const missingElements = [];
        
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.errorMessage = document.getElementById('errorMessage');
        this.loading = document.getElementById('loading');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.weatherDisplay = document.getElementById('weatherDisplay');
        this.recentList = document.getElementById('recentList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        
        // Weather info elements
        this.cityName = document.getElementById('cityName');
        this.country = document.getElementById('country');
        this.temp = document.getElementById('temp');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.cloudiness = document.getElementById('cloudiness');
        this.lastUpdated = document.getElementById('lastUpdated');
        
        // Check for missing elements
        requiredElements.forEach(id => {
            if (!document.getElementById(id)) {
                missingElements.push(id);
            }
        });
        
        if (missingElements.length > 0) {
            console.error('Missing HTML elements:', missingElements);
            alert('Error: Missing HTML elements. Please check the HTML file.');
        }
        
        console.log('Elements initialized successfully');
    }

    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        this.clearHistoryBtn.addEventListener('click', () => this.clearRecentSearches());
    }

    async handleSearch() {
        console.log('handleSearch called');
        const city = this.cityInput.value.trim();
        console.log('City entered:', city);
        
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        this.hideError();

        try {
            console.log('Fetching weather data for:', city);
            const weatherData = await this.fetchWeatherData(city);
            console.log('Weather data received:', weatherData);
            
            this.displayWeatherData(weatherData);
            this.saveToLocalStorage(city, weatherData);
            this.addToRecentSearches(city);
            this.cityInput.value = '';
        } catch (error) {
            console.error('Error in handleSearch:', error);
            this.showError(error.message);
            this.hideLoading();
        }
    }

    async fetchWeatherData(city) {
        const url = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
        console.log('API URL:', url);
        
        try {
            console.log('Making fetch request...');
            const response = await fetch(url);
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.log('Error response text:', errorText);
                
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else if (response.status === 401) {
                    throw new Error('API key is invalid. Please check your API key.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please try again later.');
                } else {
                    throw new Error(`Weather data unavailable (Error ${response.status}): ${errorText}`);
                }
            }

            const data = await response.json();
            console.log('API response data:', data);
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }

    displayWeatherData(data) {
        console.log('Displaying weather data:', data);
        
        try {
            // Validate data structure
            if (!data || !data.main || !data.weather || !data.weather[0] || !data.sys) {
                throw new Error('Invalid weather data structure received');
            }

            // Update city and country
            this.cityName.textContent = data.name || 'Unknown';
            this.country.textContent = data.sys.country || '';

            // Update temperature
            this.temp.textContent = Math.round(data.main.temp || 0);

            // Update weather icon and description
            this.updateWeatherIcon(data.weather[0].main, data.weather[0].icon);
            this.weatherDescription.textContent = data.weather[0].description || 'Unknown';

            // Update weather details
            this.feelsLike.textContent = `${Math.round(data.main.feels_like || 0)}°C`;
            this.humidity.textContent = `${data.main.humidity || 0}%`;
            this.windSpeed.textContent = `${data.wind?.speed || 0} m/s`;
            this.pressure.textContent = `${data.main.pressure || 0} hPa`;
            this.visibility.textContent = `${((data.visibility || 0) / 1000).toFixed(1)} km`;
            this.cloudiness.textContent = `${data.clouds?.all || 0}%`;

            // Update last updated time
            const now = new Date();
            this.lastUpdated.textContent = now.toLocaleString();

            this.hideLoading();
            this.showWeatherInfo();
            
            console.log('Weather display updated successfully');
        } catch (error) {
            console.error('Error displaying weather data:', error);
            this.showError('Error displaying weather data: ' + error.message);
            this.hideLoading();
        }
    }

    updateWeatherIcon(weatherMain, iconCode) {
        let iconClass = '';
        
        switch (weatherMain.toLowerCase()) {
            case 'clear':
                iconClass = 'fas fa-sun';
                break;
            case 'clouds':
                iconClass = 'fas fa-cloud';
                break;
            case 'rain':
            case 'drizzle':
                iconClass = 'fas fa-cloud-rain';
                break;
            case 'thunderstorm':
                iconClass = 'fas fa-bolt';
                break;
            case 'snow':
                iconClass = 'fas fa-snowflake';
                break;
            case 'mist':
            case 'fog':
            case 'haze':
            case 'smoke':
                iconClass = 'fas fa-smog';
                break;
            default:
                iconClass = 'fas fa-cloud-sun';
        }

        this.weatherIcon.className = iconClass;
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.weatherInfo.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showWeatherInfo() {
        this.weatherInfo.style.display = 'block';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        this.errorMessage.classList.remove('show');
    }

    saveToLocalStorage(city, weatherData) {
        const weatherStorage = {
            city: city,
            data: weatherData,
            timestamp: Date.now()
        };
        
        localStorage.setItem('weatherApp_lastSearch', JSON.stringify(weatherStorage));
    }

    loadFromLocalStorage() {
        console.log('Loading from localStorage...');
        try {
            const stored = localStorage.getItem('weatherApp_lastSearch');
            if (stored) {
                console.log('Found stored data');
                const weatherStorage = JSON.parse(stored);
                const now = Date.now();
                const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
                
                // Check if data is less than 1 hour old
                if (now - weatherStorage.timestamp < oneHour) {
                    console.log('Using cached data (less than 1 hour old)');
                    // Use stored data
                    this.displayWeatherData(weatherStorage.data);
                    this.cityInput.value = weatherStorage.city;
                } else {
                    console.log('Cached data is old, just setting city name');
                    // Data is old, just set the city name but don't auto-search
                    if (weatherStorage.city) {
                        this.cityInput.value = weatherStorage.city;
                        // Don't auto-search on page load to avoid potential issues
                        // this.handleSearch();
                    }
                }
            } else {
                console.log('No stored data found');
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    addToRecentSearches(city) {
        let recent = this.getRecentSearches();
        
        // Remove city if it already exists
        recent = recent.filter(item => item.toLowerCase() !== city.toLowerCase());
        
        // Add to beginning of array
        recent.unshift(city);
        
        // Keep only last 5 searches
        recent = recent.slice(0, 5);
        
        localStorage.setItem('weatherApp_recentSearches', JSON.stringify(recent));
        this.displayRecentSearches();
    }

    getRecentSearches() {
        try {
            const recent = localStorage.getItem('weatherApp_recentSearches');
            return recent ? JSON.parse(recent) : [];
        } catch (error) {
            console.error('Error getting recent searches:', error);
            return [];
        }
    }

    loadRecentSearches() {
        this.displayRecentSearches();
    }

    displayRecentSearches() {
        const recent = this.getRecentSearches();
        this.recentList.innerHTML = '';
        
        if (recent.length === 0) {
            this.recentList.innerHTML = '<p style="color: #636e72; font-style: italic;">No recent searches</p>';
            return;
        }

        recent.forEach(city => {
            const button = document.createElement('button');
            button.className = 'recent-item';
            button.textContent = city;
            button.addEventListener('click', () => {
                this.cityInput.value = city;
                this.handleSearch();
            });
            this.recentList.appendChild(button);
        });
    }

    clearRecentSearches() {
        localStorage.removeItem('weatherApp_recentSearches');
        this.displayRecentSearches();
    }
}

// Weather data validation utility
class WeatherValidator {
    static validateWeatherData(data) {
        const required = ['name', 'main', 'weather', 'wind', 'clouds', 'sys'];
        
        for (const field of required) {
            if (!data[field]) {
                throw new Error(`Invalid weather data: missing ${field}`);
            }
        }

        if (!data.main.temp || !data.main.humidity || !data.main.pressure) {
            throw new Error('Invalid weather data: missing temperature, humidity, or pressure');
        }

        if (!data.weather[0] || !data.weather[0].main || !data.weather[0].description) {
            throw new Error('Invalid weather data: missing weather condition');
        }

        return true;
    }
}

// Error handling utility
class ErrorHandler {
    static handleAPIError(error, statusCode) {
        switch (statusCode) {
            case 400:
                return 'Bad request. Please check your input.';
            case 401:
                return 'Invalid API key. Please check your API key.';
            case 404:
                return 'City not found. Please check the spelling and try again.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return error.message || 'An unexpected error occurred.';
        }
    }
}

// Initialize the weather app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const weatherApp = new WeatherApp();
    
    // Add service worker for offline functionality (optional enhancement)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    }
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherApp, WeatherValidator, ErrorHandler };
}