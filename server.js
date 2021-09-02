"use strict";
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const routes = require('./routes');
const connection = require('./config/database');
const path = require('path');

require('dotenv').config();

const MongoStore = require('connect-mongo')(session);

/**
 * -------------- GENERAL SETUP ----------------
 */
const app = express();
const server = require('http').Server(app);

const corsOptions = {
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
        res.send(err);
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
 * -------------- ROUTES/SOCKETS ----------------
 */

const io = require("socket.io")(server);
const users = {};

const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 5) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        socket.emit("all users", users[roomID]);
    });

    socket.oniceconnectionstatechange = function() {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        socket.emit("all users", users[roomID]);
    }
});

app.use(routes);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
    console.log("production running...")
    app.use(express.static('./client/build'))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, console.log(`server is starting at ${PORT}`));