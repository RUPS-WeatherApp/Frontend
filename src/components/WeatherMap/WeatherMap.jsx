import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WeatherMap.css';
import L from 'leaflet';
import axios from 'axios';
import WorldCities from '../../data/world-cities.json';
import weatherFetch from './weatherFetch';
// import CountryBorders from '../../data/country-borders.geojson';
import CountryBorders from '../../data/countries.json';
import weatherIconsToImageNames from '../Utils/weatherIconsToImageNames.js';

const WeatherMap = ({ maxHeight }) => {
  const [weatherData, setWeatherData] = useState([]);
  const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
  const city = 'Ljubljana'; // You can change the city or use geolocation to get dynamic data

  const [userLocation, setUserLocation] = useState(null);
  const [biggerCities, setBiggerCities] = useState(null);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });



          try {
            const username = 'feri'; // Replace with your Geonames username
            const response = axios.get(
              `http://api.geonames.org/findNearbyJSON?lat=${latitude}&lng=${longitude}&cities=10&username=${username}`
            ).then((response) => {
              if (response.data.geonames && response.data.geonames.length > 0) {
                setBiggerCities(WorldCities.filter((city) => city.country === response.data.geonames[0].countryName));
              }
            });

          } catch (error) {
            console.error('Error fetching city data:', error);
          }
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
      try {
        const response = await fetch(
          userLocation != null ? `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("valid data", data);
          setWeatherData([...weatherData, data]);
        } else {
          console.error('Failed to fetch weather data');
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [userLocation]);

  useEffect(() => {
    if (biggerCities) {
      const handleFetchWeather = async () => {
        console.log("biggerCities", biggerCities);
        try {
          const data = await weatherFetch(biggerCities.map((city) => city.name), API_KEY);
          console.log("data", data);
          setWeatherData([...weatherData, ...data]);
        } catch (error) {
          console.error(error);
        }
      };

      handleFetchWeather();
    }
  }, [biggerCities]);


  const getMarkerIcon = (data) => {
    return new L.Icon({
      // iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      iconUrl: `/weather-images/SVG/` + weatherIconsToImageNames[data.weather[0].icon],
      iconSize: [72, 72],
    });
  };

  return (
    <div style={{ height: maxHeight }}>
      {(userLocation && userLocation) ? (

        <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={8} style={{ height: '100%', }}>
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
            minZoom={3}
            maxZoom={9}
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <GeoJSON
            data={CountryBorders.features}
            style={{
              fillColor: "transparent",
              fillOpacity: 0,
              color: "black",
              weight: 2,
            }}
            onEachFeature={(country, layer) => {
              const countryName = country.properties.ADMIN;
              layer.bindPopup(countryName);

              layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
              // const colorIndex = Math.floor(Math.random() * this.colors.length);
              // layer.options.fillColor = this.colors[colorIndex]; //0

            }}
          />


          {weatherData.length > 0 && weatherData.map((data) => {
            //return { ...data, weather: data.weather.map((data2) => { return { ...data2, icon: data2.icon.replace('n', 'd')}; }) };
            return data;
          }).map((data) => (

            <Marker position={[data.coord.lat, data.coord.lon]} icon={getMarkerIcon(data)} minZoom={8}>
              <Popup>
                <div>
                  <h3>{data.name}</h3>
                  <p>
                    {data.weather[0].description} <br />
                    Temperature: {data.main.temp} °C <br />
                    Humidity: {data.main.humidity} %
                  </p>
                  <img src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="Weather Icon" />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : null}
    </div>
  );
};

export default WeatherMap;
