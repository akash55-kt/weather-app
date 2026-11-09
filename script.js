const cardBody = document.querySelector(".card-body");
const form = document.querySelector("#form");
const input = document.querySelector("#input");
const cityEl = document.querySelector("#city");
const timeEl = document.querySelector("#time");
const tempEl = document.querySelector("#temp");
const humidityEl = document.querySelector("#humidity");
const windSpeedEl = document.querySelector("#wind-speed");
const forecastEl = document.querySelector("#forecast");

async function getWeatherByCity(city) {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
    );
    const data = await response.json();

    if (data.length === 0) {
        alert("City not found");
        cardBody.innerHTML = `<h1 class="display-4 lh-1 text-body-emphasis">City not Found</h1>`;
        return;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;
    const cityName = data[0].name;

    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&forecast_days=5&timezone=auto`
    );

    const weatherData = await weatherResponse.json();


    //current weather
    // cityEl.innerText = cityName;
    // tempEl.innerText = `${weatherData.current_weather.temperature} °C`;
    // timeEl.innerText = weatherData.current_weather.time;
    // humidityEl.innerText = `Humidity: ${weatherData.hourly.relative_humidity_2m[0]}%`;
    // windSpeedEl.innerText = `Wind: ${weatherData.current_weather.windspeed} km/h`;

    cardBody.innerHTML = `<h4 class="card-title" id="city">${cityName}</h4>
                        <h1 class="display-4" id="temp">${weatherData.current_weather.temperature}°C </h1>
                        <p class="lead" id="time">${weatherData.current_weather.time}</p>
                        <div class="row mt-3">
                            <div class="col" id="humidity">Humidity: ${weatherData.hourly.relative_humidity_2m[0]}%</div>
                            <div class="col" id="wind-speed">Wind: ${weatherData.current_weather.windspeed} km/h</div>
                        </div>`

    //five day forecast
    forecastEl.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const day = new Date(weatherData.daily.time[i]).toLocaleDateString("en-US", {
            weekday: "short"
        });

        forecastEl.innerHTML += `
            <div class="col-md-2 col-6 mb-3">
                <div class="card forecast-card text-center p-2">
                    <strong>${day}</strong>
                    <div>🌡️</div>
                    <div>
                        ${weatherData.daily.temperature_2m_min[i]}°C /
                        ${weatherData.daily.temperature_2m_max[i]}°C
                    </div>
                </div>
            </div>
        `;
    }
}

//Load default city
window.addEventListener("load", () => {
    getWeatherByCity("Berhampur");
});

//Search
form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeatherByCity(input.value);
});

//dark mode
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.innerText = "☀️";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    toggleBtn.innerText = body.classList.contains("dark-mode") ? "☀️" : "🌙";
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
});
