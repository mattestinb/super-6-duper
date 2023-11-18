// Constants
const apiKey = "7e054b8b09dd564048c883ccd7c011b6";
const searchFormEl = document.querySelector("#search-form");
const cityInputEl = document.querySelector("#city-input");
const searchHistoryEl = document.querySelector("#search-history");
const currentWeatherEl = document.querySelector("#current-weather");
const forecastEl = document.querySelector("#forecast");

// Fetch Weather Data
const fetchWeatherData = (cityName, type) => {
  const baseUrl = `https://api.openweathermap.org/data/2.5/${type}`;
  const url = `${baseUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  });
};

// Search Form Submission
searchFormEl.addEventListener("submit", event => {
  event.preventDefault();
  const cityName = cityInputEl.value.trim().toUpperCase();
  if (cityName) {
    searchWeather(cityName);
  }
});

// Search Weather Function
const searchWeather = cityName => {
  fetchWeatherData(cityName, "weather")
      .then(data => {
        displayCurrentWeather(data);
        saveSearchHistory(cityName);
      })
      .catch(alert);

  fetchWeatherData(cityName, "forecast")
      .then(displayForecast)
      .catch(alert);
};

// Display Functions
const displayCurrentWeather = data => {
  const { name, dt, weather, main, wind } = data;
  const html = `
    <h1>${name} (${new Date(dt * 1000).toLocaleDateString()}) 
      <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" 
      alt="${weather[0].description}"></h1>
    <p>Temperature: ${main.temp} &deg;C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>`;
  currentWeatherEl.innerHTML = html;
  currentWeatherEl.classList.add("current-weather");
};

const displayForecast = data => {
  const forecastItems = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  const html = forecastItems.map(item => {
    const { dt, weather, main, wind } = item;
    return `
      <div>
        <h5>${new Date(dt * 1000).toLocaleDateString()}</h5>
        <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" 
        alt="${weather[0].description}">
        <p>Temp: ${main.temp} &deg;C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
      </div>`;
  }).join("");
  forecastEl.innerHTML = `<h2>5-Day Forecast:</h2>${html}`;
  forecastEl.classList.add("forecast");
};

// Search History Functions
const saveSearchHistory = cityName => {
  const searchHistory = new Set(JSON.parse(localStorage.getItem("searchHistory")) || []);
  searchHistory.add(cityName);
  localStorage.setItem("searchHistory", JSON.stringify([...searchHistory]));
  displaySearchHistory();
};

const displaySearchHistory = () => {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  const html = searchHistory.map(cityName => `<button class="button">${cityName}</button>`).join("");
  searchHistoryEl.innerHTML = `<h2>Search History</h2>${html}`;
};

searchHistoryEl.addEventListener("click", event => {
  if (event.target.tagName === 'BUTTON') {
    searchWeather(event.target.textContent);
  }
});

// Clear Search History
 document.querySelector("#clear-history").addEventListener("click", () => {
  localStorage.removeItem("searchHistory");
  displaySearchHistory();
});

// On Load
displaySearchHistory();
