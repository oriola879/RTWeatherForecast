const { ensureAuth, ensureGuest } = require('./middleware');
const request = require('supertest');
const express = require('express');
const app = express();

app.get('/protected-route', ensureAuth, (req, res) => {
  res.send('Protected Route');
});

app.get('/guest-route', ensureGuest, (req, res) => {
  res.send('Guest Route');
});

describe('Auth Middleware', () => {
  it('ensureAuth should allow access when authenticated', async () => {
    const authenticatedAgent = request.agent(app);

    await authenticatedAgent
      .get('/protected-route')
      .expect(200)
      .expect('Protected Route');
  });

  it('ensureAuth should redirect to / when not authenticated', async () => {
    await request(app)
      .get('/protected-route')
      .expect(302)
      .expect('Location', '/');
  });

  it('ensureGuest should allow access when not authenticated', async () => {
    await request(app)
      .get('/guest-route')
      .expect(200)
      .expect('Guest Route');
  });

  it('ensureGuest should redirect to / when authenticated', async () => {
    const authenticatedAgent = request.agent(app);

    await authenticatedAgent
      .get('/guest-route')
      .expect(302)
      .expect('Location', '/');
  });
});
