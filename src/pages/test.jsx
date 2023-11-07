import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Example method to find nearby cities
  const findNearbyCities = async () => {
    if (userLocation) {
      try {
        // You would typically use a weather API to get nearby city data based on user location
        // Replace 'API_KEY' with your actual API key
        const apiKey = '61f536c7ec3e62f7c4d43412de9977c8';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/find?lat=${userLocation.latitude}&lon=${userLocation.longitude}&cnt=10&APPID=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          // Process data to extract nearby cities
          const cities = data.list.map((city) => city.name);
          setNearbyCities([...new Set(cities)]);
        } else {
          console.error('Failed to fetch nearby cities');
        }
      } catch (error) {
        console.error('Error fetching nearby cities:', error);
      }
    }
  };

  useEffect(() => {
    findNearbyCities();
  }, [userLocation]);

  return (
    <div>
      <h1>User's Location</h1>
      {userLocation ? (
        <p>
          Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
        </p>
      ) : (
        <p>Loading user's location...</p>
      )}

      <h1>Nearby Cities</h1>
      <ul>
        {nearbyCities.map((city, index) => (
          <li key={index}>{city}</li>
        ))}
      </ul>
    </div>
  );
};

export default WeatherApp;
