const axios = require('axios');
const { fetchWeather } = require('./weatherService');

jest.mock('axios');

describe('fetchWeather', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch weather data successfully', async () => {
    const mockResponse = {
      data: {
        location: 'New York',
        temperature: 25,
        description: 'Partly cloudy',
      },
    };
    axios.request.mockResolvedValue(mockResponse);

    const location = 'New York';
    const weatherData = await fetchWeather(location);

    expect(weatherData).toEqual(mockResponse.data);
    expect(axios.request).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({
        location: location,
      }),
    }));
  });

  it('should throw an error if weather API request fails', async () => {
    const errorMessage = 'Network Error';
    axios.request.mockRejectedValue(new Error(errorMessage));

    const location = 'New York';
    await expect(fetchWeather(location)).rejects.toThrow(errorMessage);
  });
});
