const axios = require('axios');

const fetchWeather = async (location) => {
  const options = {
    method: 'GET',
    url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
    params: {
      contentType: 'csv',
      unitGroup: 'us',
      aggregateHours: '24',
      location: location, // Use location name
      shortColumnNames: 'false'
    },
    headers: {
      'x-rapidapi-key': 'f834301511msh6f2f801b2248d14p1cd65ejsn42529f39c82a',
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
  }
};

module.exports = { fetchWeather };
