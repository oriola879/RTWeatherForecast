const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initializePassport = require('../config/passport');

describe('Passport LocalStrategy', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany();
  });

  it('should authenticate user with valid credentials', async () => {
    const password = 'testpassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
    });
    await testUser.save();

    const req = {
      body: {
        email: 'test@example.com',
        password: 'testpassword',
      },
    };
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    initializePassport(passport);

    await new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          reject(err);
        }
        if (!user) {
          reject(new Error('Authentication failed'));
        }
        resolve(user);
      })(req, res);
    });

    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('should handle invalid credentials', async () => {
    const req = {
      body: {
        email: 'invalid@example.com',
        password: 'invalidpassword',
      },
    };
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
    };

    initializePassport(passport);

    await new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          reject(err);
        }
        if (!user) {
          reject(new Error('Authentication failed'));
        }
        resolve(user);
      })(req, res);
    });

    expect(res.render).toHaveBeenCalledWith('login', {
      title: 'Login',
      messages: { errors: [{ msg: 'Invalid email or password.' }] },
    });
  });
});
