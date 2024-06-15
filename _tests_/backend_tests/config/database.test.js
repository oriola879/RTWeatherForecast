const mongoose = require('mongoose');
const connectDB = require('../database');

describe('Database Connection', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should connect to MongoDB', async () => {
    expect(mongoose.connection.readyState).toEqual(1);
  });

  it('should handle connection errors', async () => {
    const prevDbString = process.env.DB_STRING;
    process.env.DB_STRING = 'invalid_db_string';

    await expect(connectDB()).rejects.toThrow();

    process.env.DB_STRING = prevDbString;
  });
});
