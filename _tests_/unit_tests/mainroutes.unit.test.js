const express = require('express');
const request = require('supertest');
const router = require('./index'); // Replace with your actual router file
const authController = require('../controllers/authController');
const mainController = require('../controllers/mainController');
const accountController = require('../controllers/accountController');
const { ensureAuth } = require('../middleware/auth');

jest.mock('../controllers/authController');
jest.mock('../controllers/mainController');
jest.mock('../controllers/accountController');
jest.mock('../middleware/auth');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Express Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should call mainController.getIndex', async () => {
      await request(app).get('/').expect(200);
      expect(mainController.getIndex).toHaveBeenCalled();
    });
  });

  describe('GET /account', () => {
    it('should call mainController.getAccount with ensureAuth middleware', async () => {
      await request(app).get('/account').expect(200);
      expect(ensureAuth).toHaveBeenCalled();
      expect(mainController.getAccount).toHaveBeenCalled();
    });
  });

  describe('POST /account/update-username', () => {
    it('should call accountController.updateUsername with ensureAuth middleware', async () => {
      await request(app).post('/account/update-username').expect(200);
      expect(ensureAuth).toHaveBeenCalled();
      expect(accountController.updateUsername).toHaveBeenCalled();
    });
  });

  describe('POST /account/update-email', () => {
    it('should call accountController.updateEmail with ensureAuth middleware', async () => {
      await request(app).post('/account/update-email').expect(200);
      expect(ensureAuth).toHaveBeenCalled();
      expect(accountController.updateEmail).toHaveBeenCalled();
    });
  });

  describe('POST /account/update-password', () => {
    it('should call accountController.updatePassword with ensureAuth middleware', async () => {
      await request(app).post('/account/update-password').expect(200);
      expect(ensureAuth).toHaveBeenCalled();
      expect(accountController.updatePassword).toHaveBeenCalled();
    });
  });

  describe('GET /login', () => {
    it('should call authController.getLogin', async () => {
      await request(app).get('/login').expect(200);
      expect(authController.getLogin).toHaveBeenCalled();
    });
  });

  describe('POST /login', () => {
    it('should call authController.postLogin', async () => {
      await request(app).post('/login').expect(200);
      expect(authController.postLogin).toHaveBeenCalled();
    });
  });

  describe('GET /signup', () => {
    it('should call authController.getSignup', async () => {
      await request(app).get('/signup').expect(200);
      expect(authController.getSignup).toHaveBeenCalled();
    });
  });

  describe('POST /signup', () => {
    it('should call authController.postSignup', async () => {
      await request(app).post('/signup').expect(200);
      expect(authController.postSignup).toHaveBeenCalled();
    });
  });

  describe('GET /logout', () => {
    it('should call authController.logout with ensureAuth middleware', async () => {
      await request(app).get('/logout').expect(200);
      expect(ensureAuth).toHaveBeenCalled();
      expect(authController.logout).toHaveBeenCalled();
    });
  });
});
