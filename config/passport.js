const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require.main.require('./lib/passwordUtils').validPassword;

passport.serializeUser((user, callback) => {
    callback(null, user.id);
})

passport.deserializeUser((userId, callback) => {
    User.findById(userId)
        .then((user) => {
            callback(null, user);
        })
        .catch(err => callback(err))
})

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
}

const verifyCallback = (username, password, callback) => {
    User.findOne({ username: username })
        .then((user) => {
            if (!user) { return callback(null, false) }

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                return callback(null, user)
            } else {
                return callback(null, false)
            }
        })
        .catch((err) => {
            callback(err);
        }
    );
}

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);
