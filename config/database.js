const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

const conn = process.env.DB_REMOTE;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});

const User = connection.model('User', UserSchema);

const UserRoomSchema = new mongoose.Schema({
    roomLink: String,
    user: String,
    date: Date,
    roomName: String,
    description: String,
    audioOnly: Boolean
});

const UserRoom = connection.model('UserRoom', UserRoomSchema);

// Expose the connection
module.exports = connection;