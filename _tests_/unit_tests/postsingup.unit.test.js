// unit-tests/authController.unit.test.js

const { postSignup } = require('../controllers/authController');
const validator = require('validator');
const User = require('../models/User');

jest.mock('validator', () => ({
  isEmail: jest.fn().mockReturnValue(true),
  isLength: jest.fn().mockReturnValue(true),
}));

jest.mock('../models/User', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
}));

jest.mock('passport', () => ({
  authenticate: jest.fn(),
}));

describe('Unit Tests - postSignup Function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
      },
    };
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    };
    next = jest.fn();
  });

  it('should redirect to "/" on successful signup', async () => {
    await postSignup(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should render signup page with errors on invalid inputs', async () => {
    validator.isEmail.mockReturnValueOnce(false);
    validator.isLength.mockReturnValueOnce(false);

    await postSignup(req, res, next);
    expect(res.render).toHaveBeenCalledWith('signup', {
      title: 'Create Account',
      messages: {
        errors: [
          { msg: 'Please enter a valid email address.' },
          { msg: 'Password must be at least 8 characters long' },
        ],
      },
    });
  });

  it('should render signup page with error if user already exists', async () => {
    User.findOne.mockResolvedValueOnce({ /* mock existing user */ });

    await postSignup(req, res, next);
    expect(res.render).toHaveBeenCalledWith('signup', {
      title: 'Create Account',
      messages: {
        errors: [
          { msg: 'Account with that email address or username already exists.' },
        ],
      },
    });
  });

  it('should handle errors during signup', async () => {
    const error = new Error('Signup error');
    User.create.mockRejectedValueOnce(error);

    await postSignup(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
