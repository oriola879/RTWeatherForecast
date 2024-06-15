const request = require('supertest');
const app = require('../../../app'); // Assuming your Express app is in app.js

describe('Authentication', () => {
  it('should log in with valid credentials', async () => {
    const userData = {
      email: 'testuser@example.com',
      password: 'password'
    };

    const response = await request(app)
      .post('/login')
      .send(userData)
      .expect(200);

    expect(response.body.message).toBe('Login successful');
    expect(response.body.user).toHaveProperty('userName', 'TestUser');
  });

  it('should return 401 for invalid credentials', async () => {
    const invalidUserData = {
      email: 'invaliduser@example.com',
      password: 'invalidpassword'
    };

    const response = await request(app)
      .post('/login')
      .send(invalidUserData)
      .expect(401);

    expect(response.body.error).toBe('Unauthorized');
  });
});
