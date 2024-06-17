const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should hash the password before saving', async () => {
    const userData = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
  });

  it('should validate and save a new user', async () => {
    const userData = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: userData.email });
    expect(foundUser).toBeDefined();
    expect(foundUser.userName).toBe(userData.userName);
    expect(foundUser.email).toBe(userData.email);
  });

  it('should compare passwords correctly', async () => {
    const userData = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });
});
