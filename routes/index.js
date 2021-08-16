const router = require('express').Router();
const passport = require('passport');
const genPassword = require.main.require('./lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require("./authMiddleware").isAuth;

/**
 * -------------- POST ROUTES ----------------
 */

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
            return res.status(200).send();
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

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/dashboard', isAuth, (req, res, next) => {
    res.json({
        user: req.session.passport.user
    });
});

router.get('/logout', isAuth, (req, res, next) => {
    try {
        req.logout();
    } catch (exception) {
        res.status(500).send();
    }
    res.status(200).send();
});

module.exports = router;