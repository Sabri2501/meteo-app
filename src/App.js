// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faHeart } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    forecast: [],
    error: false,
  });
  const [favoriteCities, setFavoriteCities] = useState([]);

 
  const toDateFunction = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const currentDate = new Date();
    const date = `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  // 2
  const search = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setWeather({ ...weather, loading: true });
      const urlWeather = 'https://api.openweathermap.org/data/2.5/weather';
      const urlForecast = 'https://api.openweathermap.org/data/2.5/forecast';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

      try {
        const resWeather = await axios.get(urlWeather, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });

        const resForecast = await axios.get(urlForecast, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });

        setWeather({
          data: resWeather.data,
          forecast: resForecast.data.list.filter((item, index) => index % 8 === 0), 
          loading: false,
          error: false,
        });
      } catch (error) {
        setWeather({ ...weather, data: {}, forecast: [], error: true, loading: false });
      }
      setInput('');
    }
  };

  // 3)
  const addCityToFavorites = () => {
    const cityName = weather.data.name;
    if (cityName && !favoriteCities.includes(cityName)) {
      const updatedFavorites = [...favoriteCities, cityName];
      setFavoriteCities(updatedFavorites);
      localStorage.setItem('favoriteCities', JSON.stringify(updatedFavorites));
    }
  };

  
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    setFavoriteCities(storedFavorites);
  }, []);

  const loadFavoriteCityWeather = async (city) => {
    setInput(city);
    setWeather({ ...weather, loading: true });
    search({ key: 'Enter' });
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp203</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          name="query"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
        <button className="addcity" onClick={addCityToFavorites}>
          <FontAwesomeIcon icon={faHeart} /> Ajouter aux favoris
        </button>
      </div>

      {weather.loading && (
        <Oval type="Oval" color="black" height={100} width={100} />
      )}

      {weather.error && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </div>
      )}

      {weather.data && weather.data.main && (
        <div>
          <h2>{weather.data.name}, {weather.data.sys.country}</h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent {weather.data.wind.speed} m/s</p>
        </div>
      )}

      {weather.forecast.length > 0 && (
        <div className="forecast">
          <h3>Prévisions Météo pour les 5 prochains jours</h3>
          <div className="forecast-container">
            {weather.forecast.map((day, index) => {
              const date = new Date(day.dt * 1000);
              return (
                <div key={index} className="forecast-item">
                  <h4>{date.toLocaleDateString('fr-FR')}</h4>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {favoriteCities.length > 0 && (
        <div className="favorites">
          <h3>Villes Favorites</h3>
          <ul>
            {favoriteCities.map((city, index) => (
              <li key={index} onClick={() => loadFavoriteCityWeather(city)}>
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;
