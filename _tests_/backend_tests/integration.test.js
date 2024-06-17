const request = require('supertest');
const app = require('../app');
const expect = require('chai').expect;

describe('Integration Tests for Views', () => {
  describe('GET /account', () => {
    it('should render the account page when user is logged in', async () => {
      const loggedInUser = { userName: 'testuser', email: 'testuser@example.com' };

      const res = await request(app)
        .get('/account')
        .set('Cookie', 'user=' + encodeURIComponent(JSON.stringify(loggedInUser)))
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200); 

      expect(res.text).to.include('<title>My Account</title>');
      expect(res.text).to.include('Update your account information');
    });

    it('should redirect to /login when user is not logged in', async () => {
      const res = await request(app)
        .get('/account')
        .expect('Location', '/login')
        .expect(302);
    });
  });

  describe('GET /', () => {
    it('should render the index page', async () => {
      const res = await request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);

      expect(res.text).to.include('<title>Home</title>');
      expect(res.text).to.include('Get weather update!');
    });
  });

  describe('GET /login', () => {
    it('should render the login page', async () => {
      const res = await request(app)
        .get('/login')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);

      expect(res.text).to.include('<title>Log In</title>'); 
      expect(res.text).to.include('Sign in to your account'); 
    });
  });

  describe('GET /signup', () => {
    it('should render the signup page', async () => {
      const res = await request(app)
        .get('/signup')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);

      expect(res.text).to.include('<title>Sign Up</title>');
      expect(res.text).to.include('Create your account');
      // Maybe? more assertions to validate other elements or dynamic content
    });
  });
});
