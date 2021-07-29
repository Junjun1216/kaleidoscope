"use strict";
const express = require('express');
const session = require('express-session');
const cors = require('cors');
var passport = require('passport');
var routes = require('./routes');
const connection = require('./config/database');

const MongoStore = require('connect-mongo')(session);

require('dotenv').config();

/**
 * -------------- GENERAL SETUP ----------------
 */
require('dotenv').config();
var app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function errorHandler (err, req, res, next) {
    if (err) {
        console.log(err);
        res.send('<h1>There was an error, please try again later</h1>');
    }
}

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
    mongooseConnection: connection,
    collection: 'session'
})

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    next();
});

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

app.use(errorHandler);

app.listen(3001);