const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const mainRoutes = require('./routes/mainRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const autocompleteRoutes = require('./routes/autocompleteRoutes');
const http = require('http'); // Require http module for creating server
const socketIo = require('socket.io'); // Require socket.io for real-time communication

// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Initialize the app
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = socketIo(server); // Create a socket.io instance attached to the server

// Connect to the database
const connectDb = require('./config/database');
connectDb();

// Passport configuration
require('./config/passport')(passport);

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

// Use forms for PUT and DELETE requests
app.use(methodOverride('_method'));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Setup sessions - stored in MongoDB
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to set user in res.locals
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Flash messages middleware
app.use(flash());

app.get('/', (req, res) => {
    res.render('index');
});

// Define your routes here
app.use('/', mainRoutes);
app.use('/weather', weatherRoutes);
app.use('/weather/autocomplete', autocompleteRoutes);

// Define CSS file
app.use(express.static('views', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Handle new weather data event
    socket.on('newWeatherData', ({ location, weatherData }) => {
        // Broadcast the weather update to all connected clients
        io.emit('weatherUpdate', { location, weatherData });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
