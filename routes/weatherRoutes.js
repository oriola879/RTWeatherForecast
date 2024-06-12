const express = require('express');
const autocompleteRoutes = require('./autocompleteRoutes');
const { fetchWeather } = require('../services/weatherService');

const router = express.Router();

router.use('/autocomplete', autocompleteRoutes);

router.get('/:location', async (req, res) => {
  const { location } = req.params;
  try {
    const weatherData = await fetchWeather(location);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;
