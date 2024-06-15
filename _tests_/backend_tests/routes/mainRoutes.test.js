const request = require('supertest');
const app = require('../app');

describe('Main Routes', () => {
  it('should return homepage', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.text).toContain('<title>Homepage</title>');
  });

  it('should redirect to login page if not authenticated', async () => {
    const response = await request(app)
      .get('/account')
      .expect(302);

    expect(response.header.location).toBe('/login');
  });

  it('should render account page if authenticated', async () => {
    const agent = request.agent(app);
    await agent.post('/login').send({ email: 'test@example.com', password: 'password' });

    const response = await agent.get('/account').expect(200);

    expect(response.text).toContain('<title>Account</title>');
  });
});
