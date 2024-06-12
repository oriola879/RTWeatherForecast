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

// Load environment variables
require('dotenv').config({ path: './config/.env' });

// Initialize the app
const app = express();

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

// Define your routes here
app.use('/', mainRoutes);

// Define CSS file
app.use(express.static('views', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server is running at ' + process.env.PORT);
});
