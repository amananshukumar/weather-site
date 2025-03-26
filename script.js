const getWeather = async () => {
    const city = document.getElementById('city').value;
    const output = document.getElementById('output');
    const error = document.getElementById('error');
    output.innerHTML = '';
    error.textContent = '';

    if (!city) {
        error.textContent = 'Please enter a city name.';
        return;
    }

    try {
        // Fetch coordinates of the city using Open-Meteo Geo API
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        if (!geoResponse.ok) {
            throw new Error('City not found');
        }
        const geoData = await geoResponse.json();
        if (!geoData.results || geoData.results.length === 0) {
            error.textContent = 'City not found. Please try a different city.';
            return;
        }

        const { latitude, longitude } = geoData.results[0];

        // Fetch weather data using coordinates
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await weatherResponse.json();
        const { temperature, weathercode } = weatherData.current_weather;

        output.innerHTML = `
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Temperature:</strong> ${temperature.toFixed(1)}°C</p>
            <p><strong>Condition Code:</strong> ${weathercode}</p>
        `;
    } catch (err) {
        error.textContent = 'Could not fetch weather data. Please try again later.';
    }
};

document.getElementById('getWeather').addEventListener('click', getWeather);
