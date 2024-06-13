const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:input', async (req, res) => {
  const { input } = req.params;
  const options = {
    method: 'GET',
    url: 'https://google-place-autocomplete-and-place-info.p.rapidapi.com/maps/api/place/autocomplete/json',
    params: { input },
    headers: {
      'x-rapidapi-key': '534a9a1d69msh376cc3579b2d292p1a19efjsn2f1fd96bc35d',
      'x-rapidapi-host': 'google-place-autocomplete-and-place-info.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch autocomplete suggestions' });
  }
});

module.exports = router;
