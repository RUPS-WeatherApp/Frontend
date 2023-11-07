import React, { useState, useEffect } from 'react';
import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import { Drawer, List, ListItem } from "@mui/material";
import { IconDashboard, IconCalendar, IconNotes, IconMap, IconMapPinHeart, IconMapPinSearch, IconLocationSearch, IconSearch, IconSatellite } from "@tabler/icons-react";

const Menu = () => {
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
        const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
        console.log("key", apiKey);
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
    <List>
      <ListItem disabled dense >
        <ListItemText primary="QUICK LINKS" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <IconMap />
        </ListItemIcon>
        <ListItemText primary="Standard Map" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <IconSearch />
        </ListItemIcon>
        <ListItemText primary="Search" />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <IconSatellite />
        </ListItemIcon>
        <ListItemText primary="Satellite Animation" />
      </ListItem>
      <Divider />
      {nearbyCities.length > 0 ? (
        <>
          <ListItem disabled dense >
            <ListItemText primary="NEARBY CITIES" />
          </ListItem>
          {nearbyCities.slice(0, 7).map((city, index) => (
            <ListItem button key={index}>
              <ListItemIcon>
                <IconMapPinHeart />
              </ListItemIcon>
              <ListItemText primary={city} />
            </ListItem>
          ))}
        </>
      ) : null}
    </List>
  );
};

export default Menu;
