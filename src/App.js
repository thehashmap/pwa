import React, {useState, useEffect} from 'react'
import { fetchWeather } from './api/FetchWeather';
import './App.css';

const App = () => {

    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    
    const search = async (e) => {
        if(e.key === 'Enter') {
            const data = await fetchWeather(query);
            setWeather(data);
            setQuery('');
        }
    }

    const getPosition = (options) => {
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
      }
      
    const getWeather = async (lat, lon) => {     
        const api_call = await fetch(`//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=f33a484cf794d08d0148764789aaba32&units=metric`);
        const data = await api_call.json();
        setWeather(data);
        setQuery('');
    }

    useEffect(() => {
        if (navigator.geolocation) {
            getPosition()
            .then((position) => {      
              getWeather(position.coords.latitude, position.coords.longitude)
            })
          }
          else {
            alert("Geolocation not available , You can still search manually :)")
          }
    }, []);

    return (
        <div className='main-container'>
            <input
                type="text"
                className="search"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} 
                onKeyPress={search}
            />
            {weather.main && (
                <div className='city'>
                    <h2 className='city-name'>
                        <span>{weather.name}</span>
                        <sup>{weather.sys.country}</sup>
                    </h2>
                    <div className='city-temp'>
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>
                    </div>
                    <div className='info'>
                        <img className="city-icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                        <p>{weather.weather[0].description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App
