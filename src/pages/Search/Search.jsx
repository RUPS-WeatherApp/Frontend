import { Box, Container, Grid, TextField, Typography, Paper } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from 'react';
import weatherIconsToImageNames from '../../components/Utils/weatherIconsToImageNames.js';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './Search.css';

const Search = ({ maxHeight }) => {
  const theme = useTheme();

  const [userLocation, setUserLocation] = useState(null);
  const { city } = useParams();
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      }, (error) => {
        console.error("Error getting user's location:", error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (city) {
      setSelectedCity(city);
      console.log("city", city);
    }
    else if (userLocation) {
      const username = 'feri'; // Replace with your Geonames username
      const response = axios.get(
        `http://api.geonames.org/findNearbyJSON?lat=${userLocation.latitude}&lng=${userLocation.longitude}&cities=10&username=${username}`
      ).then((response) => {
        if (response.data.geonames && response.data.geonames.length > 0) {
          setSelectedCity(response.data.geonames[0].name);
          setWeather({ ...weather, cityName: response.data.geonames[0].name });
        }
      });
    }
    setIsLoading(true);
  }, [userLocation, city]);

  const [weather, setWeather] = useState({
    cityName: '',
    average: {
      temperature: 0,
      weather: '',
      humidity: 0,
      icon: ''
    },
    all: [
      { source: 'OpenWeatherMap', temperature: 20, weather: 'Sunny with clouds', humidity: 79, icon: "02d" },
      { source: 'CNN Weather', temperature: 21, weather: 'Fog', humidity: 81, icon: "02d" },
      { source: 'ARSO Slovenija', temperature: 20, weather: 'Sunny with clouds', humidity: 81, icon: "02d" },
      { source: 'Weather BBC', temperature: 19, weather: 'Sunny', humidity: 83, icon: "02d" },
      { source: 'Google Weather', temperature: 20, weather: 'Windy', humidity: 82, icon: "02d" },
      { source: 'My Weather', temperature: 20, weather: 'Sunny with clouds', humidity: 80, icon: "02d" },
      { source: 'OpenWeatherMap', temperature: 20, weather: 'Sunny with clouds', humidity: 79, icon: "02d" },
      { source: 'CNN Weather', temperature: 21, weather: 'Fog', humidity: 81, icon: "02d" },
      { source: 'ARSO Slovenija', temperature: 20, weather: 'Sunny with clouds', humidity: 81, icon: "02d" },
      { source: 'Weather BBC', temperature: 19, weather: 'Sunny', humidity: 83, icon: "02d" },
      { source: 'Google Weather', temperature: 20, weather: 'Windy', humidity: 82, icon: "02d" },
      { source: 'My Weather', temperature: 20, weather: 'Sunny with clouds', humidity: 80, icon: "02d" },
    ]
  });

  useEffect(() => {
    if(!selectedCity) return;

    const response = axios.get(`${process.env.REACT_APP_API_URL}${selectedCity}`).then((response) => {
      console.log("response", response);
      if (response.data) {
        setWeather({
          ...weather,
          average: {
            temperature: Math.ceil(response.data.temperature),
            humidity: Math.ceil(response.data.humidity),
            weather: response.data.weather.main,
            icon: response.data.weather.icon
          },
          cityName: response.data.cityName
        });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error getting user's location:", error);
      setIsLoading(false);
    });
  }, [selectedCity]);

  console.log("icon", `/weather-images/SVG/` + weatherIconsToImageNames['02d']);

  return (
    <Box sx={{ height: maxHeight, backgroundColor: theme.palette.secondary.dark, overflowY: 'auto', position: "relative" }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <Container>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search for a city"
          InputProps={{
            startAdornment: <><IconSearch /><span style={{ width: "20px" }}></span></>,
            style: {
              backgroundColor: 'white',
            },
            inputProps: {
              style: {
                color: 'black',
              },
            },
            sx: {
              marginTop: 2
            }
          }}
          onSubmit={(e) => {
            console.log("e", e);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setSelectedCity(e.target.value);
              setIsLoading(true);
            }
          
          }}
        />

        <Grid container>

          <Grid item md={6} sm={12} sx={{ pt: 6 }}>
            <Box sx={{ px: 8 }}>
              <img src={`/weather-images/SVG/` + weatherIconsToImageNames[weather.average.icon]} alt={weather.average.weather} />
            </Box>


            <Box sx={{ color: "white", borderRadius: 24 }}>
              {/* current temperature */}
              <Typography variant="h1" sx={{ fontWeight: 700, textAlign: "center" }}>
                {weather.average.temperature} °C
              </Typography>

              {/* current weather */}
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center" }}>
                {weather.average.weather}
              </Typography>
            </Box>
          </Grid>

          <Grid item md={6} sm={12} sx={{ pt: 6, }}>
            <Box sx={{ p: 2, color: "white", backgroundColor: "transparent", borderRadius: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, textAlign: "center" }}>
                {weather.cityName}
              </Typography>

              <hr />

              <Grid container spacing={2} sx={{ display: 'flex' }} >
                <Grid item xs={6}>
                  <Typography variant="p" sx={{ textAlign: 'right', fontSize: '1.2rem', }}>Current temperature:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="p" sx={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold' }}>{weather.average.temperature} °C</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="p" sx={{ textAlign: 'right', fontSize: '1.2rem', }}>Weather:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="p" sx={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold' }}>{weather.average.weather}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="p" sx={{ textAlign: 'right', fontSize: '1.2rem', }}>Humidity:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="p" sx={{ textAlign: 'left', fontSize: '1.2rem', fontWeight: 'bold' }}>{weather.average.humidity}%</Typography>
                </Grid>
              </Grid>

              <hr />

              <TableContainer hidden component={Box} sx={{ backgroundColor: "transparent", color: "white", mt: 4, }}>
                <Table size="small" aria-label="All sources" sx={{ color: "white" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" fontWeight="bold" sx={{ color: "white" }}>Source</TableCell>
                      <TableCell align="center" fontWeight="bold" sx={{ color: "white" }}>Weather</TableCell>
                      <TableCell align="center" fontWeight="bold" sx={{ color: "white" }}>Temperature</TableCell>
                      <TableCell align="center" fontWeight="bold" sx={{ color: "white" }}>Humidity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weather.all.map((row, index) => (
                      <TableRow
                        key={row.source + index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell sx={{ color: "white" }} component="th" scope="row">{row.source}</TableCell>
                        <TableCell sx={{ color: "white" }} align="center">{row.weather}</TableCell>
                        <TableCell sx={{ color: "white" }} align="center">{row.temperature} °C</TableCell>
                        <TableCell sx={{ color: "white" }} align="center">{row.humidity} %</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>


      </Container>

    </Box>
  );
};

export default Search;