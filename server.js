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
const messages = {};

const socketToRoom = {};

io.on('connection', socket => {

    /** video call **/

    socket.on("join room", ({roomID, displayName, userStatus}) => {
        connection.models.UserRoom.findOne({roomLink: roomID})
            .then((userRoom) => {
                if (!userRoom) {
                    socket.emit("invalid room code", {message: "Room Not Found"});
                } else {
                    if (users[roomID]) {
                        const length = users[roomID].length;
                        if (length === 4) {
                            socket.emit("room full");
                            return;
                        }
                        users[roomID].push({id: socket.id, displayName: displayName, userStatus: userStatus});
                    } else {
                        users[roomID] = [{id: socket.id, displayName: displayName, userStatus: userStatus}];
                        messages[roomID] = [];
                    }

                    socketToRoom[socket.id] = roomID;
                    const usersInThisRoom = users[roomID].filter(user => user.id !== socket.id);

                    socket.join(roomID);
                    socket.emit("all users", {users: usersInThisRoom, roomData: userRoom});
                    socket.emit("all messages", messages[roomID]);
                }
            })
            .catch((err) => {
                    console.log(err);
                    socket.emit("error", {message: "Cannot Get Room At This Time"});
                }
            );
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, displayName: payload.callerDisplayName, userStatus: payload.callerStatus });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on("update user status", (userStatus) => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        let index = room.findIndex(user => user.id === socket.id);


        room[index].userStatus = userStatus;
        socket.to(roomID).emit("update user status", {id: socket.id, userStatus: userStatus});
    })

    /** chat room **/

    socket.on("message to room", ({message, date, displayName, userID}) => {
        const roomID = socketToRoom[socket.id];

        if (messages[roomID]) {
            messages[roomID].push({userID: userID, message: message, date: date, displayName: displayName})
        } else {
            messages[roomID] = [{userID: userID, message: message, date: date, displayName: displayName}]
        }

        io.to(roomID).emit("all messages", messages[roomID]);
    })

    /** end call **/

    socket.on("end call", () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];

        if (room) {
            room = room.filter(user => user.id !== socket.id);
            users[roomID] = room;
            for (let index = 0; index < room.length; index++) {
                io.to(room[index].id).emit("update users", users[roomID]);
            }
        }

        socket.leave(roomID);
        delete socketToRoom[socket.id]
    });

    socket.on("disconnect", () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];

        if (room) {
            room = room.filter(user => user.id !== socket.id);
            users[roomID] = room;
            for (let index = 0; index < room.length; index++) {
                io.to(room[index].id).emit("update users", users[roomID]);
            }
        }

        socket.leave(roomID);
        delete socketToRoom[socket.id]
    });
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