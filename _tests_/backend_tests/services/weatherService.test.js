const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { fetchWeather } = require('../services/weatherService');

describe('Weather Service', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fetches weather data successfully', async () => {
    const location = 'New York';
    const mockResponse = {
      data: {
        location: { name: location },
        currentConditions: { temp: 20, description: 'Cloudy' },
        // Include other relevant fields based on your actual response structure
      },
    };

    mock.onGet('https://visual-crossing-weather.p.rapidapi.com/forecast', {
      params: {
        contentType: 'json',
        unitGroup: 'metric',
        aggregateHours: '24',
        location: location,
        shortColumnNames: 'false',
      },
    }).reply(200, mockResponse);

    const weatherData = await fetchWeather(location);

    expect(weatherData.location.name).toEqual(location);
    expect(weatherData.currentConditions.temp).toEqual(20);
    expect(weatherData.currentConditions.description).toEqual('Cloudy');
    // Add more expectations based on your response structure
  });

  it('handles errors when fetching weather data', async () => {
    const location = 'InvalidCity';
    const errorMessage = 'Request failed with status code 404';

    mock.onGet('https://visual-crossing-weather.p.rapidapi.com/forecast').reply(404, errorMessage);

    try {
      await fetchWeather(location);
    } catch (error) {
      expect(error.message).toEqual(errorMessage);
    }
  });
});
