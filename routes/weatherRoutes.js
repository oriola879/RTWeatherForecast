const express = require('express');
const { fetchWeather } = require('../services/weatherService');
const router = express.Router();

router.get('/:latitude/:longitude', async (req, res) => {
  const { latitude, longitude } = req.params;
  try {
    const weatherData = await fetchWeather(latitude, longitude);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;