import axios from "axios";

const weatherFetch = async (cityNames, apiKey) => {
    const weatherPromises = cityNames.map(async (city) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error(`Failed to fetch weather data for ${city}`);
            }
        } catch (error) {
            throw new Error(`Error fetching weather data for ${city}: ${error.message}`);
        }
    });

    return Promise.all(weatherPromises);
};

export default weatherFetch;