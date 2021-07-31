const router = require('express').Router();
const passport = require('passport');
const genPassword = require.main.require('./lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require("./authMiddleware").isAuth;

/**
 * -------------- POST ROUTES ----------------
 */

// router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: '/login-success'}));
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('failed');
            return res.status(401).send();
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log('successful');
            return res.redirect('/user/' + user.username);
        });
    })(req, res, next);
});

router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: false
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });
    res.status(200).send();
});


/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.status(200)
});

router.get('/login', (req, res, next) => {
    res.status(200);
});

router.get('/register', (req, res, next) => {
    res.status(200);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/user/:user', isAuth, (req, res, next) => {
    res.send('Hello ' + req.params.user);
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-failure', (req, res, next) => {
    res.send('/login-failure');
});

module.exports = router;