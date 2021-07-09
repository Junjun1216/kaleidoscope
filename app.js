const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
// var routes = require('./routes');
// const connection = require('./config/database');

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

// Need to require the entire Passport config module so app.js knows about it
// require('./config/passport');

/**
 * -------------- GENERAL SETUP ----------------
 */

// // Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
// require('dotenv').config();

// Create the Express application
var app = express();

const dbString = "mongodb://127.0.0.1:27017/kaleidoscope"
const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connection = mongoose.createConnection(dbString, dbOptions);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = MongoStore.create({
    mongoUrl: dbString,
    collectionName: 'session'
})

app.use(session({
    secret: 'yaetsue12161998',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.get('/', (req, res, next) => {
    console.log(req.session);
    if (req.session.viewCount) {
        req.session.viewCount++;
    } else {
        req.session.viewCount = 1
    }
    res.send(`<h1>You have visited this page ${req.session.viewCount} times</h1>`);
});

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
// app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);