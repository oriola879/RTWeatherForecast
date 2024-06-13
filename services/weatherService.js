const axios = require('axios');

const fetchWeather = async (location) => {
  const options = {
    method: 'GET',
    url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
    params: {
      contentType: 'json',
      unitGroup: 'metric',
      aggregateHours: '24',
      location: location,
      shortColumnNames: 'false'
    },
    headers: {
      'x-rapidapi-key': '534a9a1d69msh376cc3579b2d292p1a19efjsn2f1fd96bc35d',
      'x-rapidapi-host': 'visual-crossing-weather.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
    console.error(error);
  }
};

module.exports = { fetchWeather };
