const request = require('supertest');
const app = require('../app');

describe('Autocomplete Routes', () => {
  it('should fetch autocomplete suggestions for a location', async () => {
    const input = 'New York';
    const response = await request(app)
      .get(`/autocomplete/${encodeURIComponent(input)}`)
      .expect(200);

    expect(response.body).toHaveProperty('predictions');
    expect(response.body.predictions).toBeInstanceOf(Array);
  });

  it('should handle errors gracefully', async () => {
    const invalidInput = 'InvalidCity';
    const response = await request(app)
      .get(`/autocomplete/${encodeURIComponent(invalidInput)}`)
      .expect(500);

    expect(response.body).toHaveProperty('error');
  });
});
