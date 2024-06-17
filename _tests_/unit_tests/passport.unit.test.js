const passportConfig = require('./passportConfig');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

describe('Passport Configuration', () => {
  let mockPassport;

  beforeEach(() => {
    mockPassport = {
      use: jest.fn(),
      serializeUser: jest.fn(),
      deserializeUser: jest.fn(),
    };

    passportConfig(mockPassport);
  });

  it('should configure LocalStrategy for passport', () => {
    const localStrategy = mockPassport.use.mock.calls[0][0];

    User.findOne = jest.fn();

    const mockUser = { 
      email: 'test@example.com',
      password: 'hashedPassword123',
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(mockUser);

    const done = jest.fn();

    localStrategy('test@example.com', 'password123', done);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
    expect(done).toHaveBeenCalledWith(null, mockUser);
  });

  it('should handle authentication failure with LocalStrategy', () => {
    const localStrategy = mockPassport.use.mock.calls[0][0];

    User.findOne = jest.fn().mockResolvedValue(null);

    const done = jest.fn();

    localStrategy('nonexistent@example.com', 'password123', done);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
    expect(done).toHaveBeenCalledWith(null, false, { msg: 'Email nonexistent@example.com not found.' });
  });

  // Will add more test cases as needed for edge cases, error handling, and serialization/deserialization
});
