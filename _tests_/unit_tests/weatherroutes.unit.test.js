const express = require('express');
const request = require('supertest');
const router = require('./weatherRoutes'); // Replace with your actual router file
const { fetchWeather } = require('../services/weatherService');

jest.mock('../services/weatherService');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Weather Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /:location', () => {
    it('should call fetchWeather with the location parameter', async () => {
      const mockWeatherData = { temperature: 20, description: 'Cloudy' };
      fetchWeather.mockResolvedValue(mockWeatherData);

      const location = 'New York';
      const response = await request(app).get(`/${location}`).expect(200);

      expect(fetchWeather).toHaveBeenCalledWith(location);
      expect(response.body).toEqual(mockWeatherData);
    });

    it('should return 500 and error message if fetchWeather throws an error', async () => {
      fetchWeather.mockRejectedValue(new Error('Weather service unavailable'));

      const location = 'New York';
      const response = await request(app).get(`/${location}`).expect(500);

      expect(fetchWeather).toHaveBeenCalledWith(location);
      expect(response.body).toEqual({ error: 'Failed to fetch weather data' });
    });
  });

  // Will add more tests as needed for different scenarios and edge cases
});
