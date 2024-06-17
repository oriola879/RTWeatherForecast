const mongoose = require('mongoose');
const connectDB = require('./connectDB');

describe('connectDB', () => {
  const mockLog = jest.spyOn(console, 'log').mockImplementation();
  const mockError = jest.spyOn(console, 'error').mockImplementation();

  beforeAll(() => {
    mongoose.connect = jest.fn().mockResolvedValue({
      connection: { host: 'localhost' },
    });
  });

  afterAll(() => {
    mockLog.mockRestore();
    mockError.mockRestore();
    mongoose.connect.mockRestore();
  });

  it('should connect to MongoDB', async () => {
    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_STRING, expect.any(Object));
    expect(mockLog).toHaveBeenCalledWith(`MongoDB Connected: localhost`);
    expect(mockError).not.toHaveBeenCalled();
  });

  it('should handle connection error', async () => {
    mongoose.connect = jest.fn().mockRejectedValue(new Error('Connection failed'));

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.DB_STRING, expect.any(Object));
    expect(mockLog).not.toHaveBeenCalled();
    expect(mockError).toHaveBeenCalledWith(new Error('Connection failed'));
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
