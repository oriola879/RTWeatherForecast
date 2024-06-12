const axios = require('axios');

const fetchWeather = async () => {
  const options = {
    method: 'GET',
    url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
    params: {
      contentType: 'csv',
      unitGroup: 'us',
      aggregateHours: '24',
      location: 'Washington,DC,USA',
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
    return response.data; // Optionally return the data
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error; // Optionally re-throw the error
  }
};

// Example usage:
fetchWeather();