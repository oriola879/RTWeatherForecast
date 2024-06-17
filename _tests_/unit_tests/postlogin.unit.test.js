// unit-tests/authController.unit.test.js

const { postLogin } = require('../controllers/authController');
const validator = require('validator');

jest.mock('validator', () => ({
  isEmail: jest.fn().mockReturnValue(true),
  isEmpty: jest.fn().mockReturnValue(false),
  normalizeEmail: jest.fn().mockReturnValue('test@example.com'),
}));

jest.mock('../models/User', () => ({
  findOne: jest.fn().mockResolvedValue(null),
}));

jest.mock('passport', () => ({
  authenticate: jest.fn(),
}));

describe('Unit Tests - postLogin Function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    };
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    };
    next = jest.fn();
  });

  it('should redirect to "/" on successful login', async () => {
    passport.authenticate.mockImplementation((strategy, callback) => {
      callback(null, { /* mock user object */ });
    });

    await postLogin(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should render login page with errors on invalid credentials', async () => {
    passport.authenticate.mockImplementation((strategy, callback) => {
      callback(null, false, 'Invalid credentials');
    });

    await postLogin(req, res, next);
    expect(res.render).toHaveBeenCalledWith('login', {
      title: 'Login',
      messages: { errors: [{ msg: 'Invalid credentials' }] },
    });
  });

  it('should render login page with validation errors', async () => {
    validator.isEmail.mockReturnValueOnce(false);
    validator.isEmpty.mockReturnValueOnce(true);

    await postLogin(req, res, next);
    expect(res.render).toHaveBeenCalledWith('login', {
      title: 'Login',
      messages: {
        errors: [
          { msg: 'Please enter a valid email address.' },
          { msg: 'Password cannot be blank.' },
        ],
      },
    });
  });

  it('should handle authentication error', async () => {
    passport.authenticate.mockImplementation((strategy, callback) => {
      callback(new Error('Authentication error'));
    });

    await postLogin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
