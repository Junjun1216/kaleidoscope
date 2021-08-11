"use strict";
const express = require('express');
const session = require('express-session');
const cors = require('cors');
var passport = require('passport');
var routes = require('./routes');
const connection = require('./config/database');
const path = require('path');
require('dotenv').config();

const MongoStore = require('connect-mongo')(session);

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();

const corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    'credentials': true,
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function errorHandler (err, req, res, next) {
    if (err) {
        res.status(err.status);
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

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
    app.use(express.static('../client/build'))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log(`server is starting at ${PORT}`));