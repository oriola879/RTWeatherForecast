const express = require('express');
const request = require('supertest');
const axios = require('axios');
const router = require('./autocompleteRouter'); // Replace with your actual router file

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Autocomplete Router', () => {
  it('should fetch autocomplete suggestions successfully', async () => {
    const mockResponse = {
      data: {
        predictions: [
          { description: 'San Francisco, CA, USA' },
          { description: 'San Jose, CA, USA' },
          { description: 'San Diego, CA, USA' },
        ],
      },
    };
    axios.request.mockResolvedValue(mockResponse);

    const input = 'San';
    const response = await request(app).get(`/${input}`).expect(200);

    expect(response.body.predictions).toHaveLength(3);
    expect(response.body.predictions[0].description).toBe('San Francisco, CA, USA');
  });

  it('should handle API errors', async () => {
    const errorMessage = 'API Error';
    axios.request.mockRejectedValue(new Error(errorMessage));

    const input = 'San';
    const response = await request(app).get(`/${input}`).expect(500);

    expect(response.body.error).toBe('Failed to fetch autocomplete suggestions');
  });
});
