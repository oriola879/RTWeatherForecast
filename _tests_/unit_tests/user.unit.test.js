const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('User Model', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password before saving', async () => {
    const mockUser = new User({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    bcrypt.genSalt.mockResolvedValue('mockedSalt');
    bcrypt.hash.mockResolvedValue('hashedPassword');

    await mockUser.save();

    expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(mockUser.password).toEqual('hashedPassword');
  });

  it('should compare passwords correctly', async () => {
    const mockUser = new User({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    bcrypt.compare.mockResolvedValue(true);

    const result = await mockUser.comparePassword('password123');

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(result).toEqual(true);
  });

  it('should fail to compare incorrect passwords', async () => {
    const mockUser = new User({
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    bcrypt.compare.mockResolvedValue(false);

    const result = await mockUser.comparePassword('wrongPassword');

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(result).toEqual(false);
  });

  // Add more tests for other aspects of the User model (field validations, unique constraints, etc.)
});
