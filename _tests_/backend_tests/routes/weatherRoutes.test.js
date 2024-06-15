const request = require('supertest');
const app = require('../app');

describe('Weather Routes', () => {
  it('should fetch weather data for a location', async () => {
    const location = 'New York';
    const response = await request(app)
      .get(`/weather/${encodeURIComponent(location)}`)
      .expect(200);

    expect(response.body).toHaveProperty('temperature');
    expect(response.body).toHaveProperty('description');
  });

  it('should return 404 for invalid location', async () => {
    const invalidLocation = 'InvalidCity';
    const response = await request(app)
      .get(`/weather/${encodeURIComponent(invalidLocation)}`)
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});
