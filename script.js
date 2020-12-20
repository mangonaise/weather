const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const temperatureText = document.getElementById('temperature');
const locationText = document.getElementById('location');
const weatherDescriptionText = document.getElementById('description');
const unitsButton = document.getElementById('units');

let units = 'celsius';

let currentTemperature = undefined;

searchButton.addEventListener('mouseup', () => {
    searchInput.classList.remove('no-width');
    searchInput.focus();
});

searchInput.addEventListener('keyup', (keyEvent) => {
    if (keyEvent.key === 'Enter') submitLocationSearch(searchInput.value);
})

unitsButton.addEventListener('click', switchUnits);

document.addEventListener('mousedown', clearSearch);

async function submitLocationSearch(location) {
    clearSearch();

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1ab1cbfffac40206bec3585fd01bc9d8`, {mode: 'cors'});
        let data = await response.json();
        displayWeatherData(data);
    } catch {
        displayError(location)
    }
}

function clearSearch() {
    searchInput.value = '';
    searchInput.classList.add('no-width');
}

function displayWeatherData(data) {
    locationText.textContent = `${data.name}, ${data.sys.country}`
    currentTemperature = data.main.temp;
    temperatureText.textContent = convertTemperature(currentTemperature)

    let weather = data.weather[0].description;
    weather = weather[0].toUpperCase() + weather.slice(1) + ".";
    weatherDescriptionText.textContent = weather;
}

function displayError(attemptedSearch) {
    locationText.textContent = attemptedSearch;
    temperatureText.textContent = '🤷';
    weatherDescriptionText.textContent = "That's not a place.";
    currentTemperature = undefined;
}

function convertTemperature(kelvin) {
    let converted;
    if (units === 'celsius') {
        converted = kelvin - 273.15;
    } else if (units === 'fahrenheit') {
        converted = kelvin * (9/5) - 459.67;
    }

    return Math.round(converted * 10) / 10;
}

function switchUnits() {
    if (units === 'celsius') {
        units = 'fahrenheit';
        unitsButton.textContent = '°F';
    } else if (units === 'fahrenheit') {
        units = 'celsius';
        unitsButton.textContent = '°C'
    }

    if (currentTemperature) {
        temperatureText.textContent = convertTemperature(currentTemperature);
    } 
}