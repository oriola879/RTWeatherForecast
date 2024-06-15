const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  await mongoose.connect(process.env.DB_STRING_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

describe('GET /weather', () => {
  it('should respond with status 200', async () => {
    const response = await request(app).get('/weather');
    expect(response.status).toBe(200);
  });
});

describe('GET /weather/autocomplete/:input', () => {
  it('should respond with status 200 for valid input', async () => {
    const response = await request(app).get('/weather/autocomplete/New York');
    expect(response.status).toBe(200);
  });

  it('should respond with status 404 for invalid input', async () => {
    const response = await request(app).get('/weather/autocomplete/invalidinput');
    expect(response.status).toBe(404);
  });
});

// Will add more tests for other routes as needed

describe('POST /login', () => {
  it('should respond with status 200 and redirect to / on successful login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });
    expect(response.status).toBe(200);
    expect(response.redirect).toBe(true);
    expect(response.headers.location).toBe('/');
  });

  it('should respond with status 401 for invalid login credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'invalid@example.com',
        password: 'invalidpassword',
      });
    expect(response.status).toBe(401);
  });
});


describe('GET /account', () => {
  it('should respond with status 302 and redirect to /login when not authenticated', async () => {
    const response = await request(app).get('/account');
    expect(response.status).toBe(302);
    expect(response.redirect).toBe(true);
    expect(response.headers.location).toBe('/login');
  });

  // Will add more test if needed for more scenario examples
});

describe('Socket.io', () => {
  let server;
  let agent;

  beforeAll((done) => {
    server = app.listen(process.env.PORT || 3001, () => {
      agent = request.agent(server);
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should receive weatherUpdate event', (done) => {
    agent.get('/')
      .end(() => {
        const socket = require('socket.io-client')(`http://localhost:${process.env.PORT || 3001}`);

        socket.on('connect', () => {
          socket.emit('newWeatherData', { location: 'New York', weatherData: { temp: 20 } });
        });

        socket.on('weatherUpdate', (data) => {
          expect(data.location).toBe('New York');
          expect(data.weatherData.temp).toBe(20);
          socket.disconnect();
          done();
        });
      });
  });
});
