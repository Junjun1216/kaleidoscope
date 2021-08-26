const router = require('express').Router();
const passport = require('passport');
const genPassword = require.main.require('./lib/passwordUtils').genPassword;
const connection = require('../config/database');
const models = connection.models;
const isAuth = require("./authMiddleware").isAuth;

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/api/login', function(req, res, next) {
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

router.post('/api/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new models.User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: false
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        console.log(newUser);
        res.status(200).send();
    });
});

router.post("/api/createRoom", isAuth, (req, res, next) => {
    const newRoom = new models.UserRoom({
        roomLink: req.body.roomLink,
        user: req.session.passport.user,
        date: req.body.date,
        roomName: req.body.roomName,
        description: req.body.description,
        audioOnly: req.body.audioOnly
    });

    newRoom.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }
        console.log(newRoom);
        res.status(200).send();
    });

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
router.get('/api/dashboard', isAuth, (req, res, next) => {
    res.json({
        user: req.session.passport.user
    });
});

router.get('/api/validateMeeting/:link', isAuth, (req, res, next) => {
    models.UserRoom.findOne({ roomLink: req.params.link })
        .then((userRoom) => {
            if (!userRoom) {
                res.status(404).send();
            }
            res.status(200).send();
        })
        .catch((err) => {
            res.status(500).send();
            console.log(err);
            }
        );
});

router.get('/api/logout', isAuth, (req, res, next) => {
    try {
        req.logout();
    } catch (exception) {
        res.status(500).send();
    }
    res.status(200).send();
});

module.exports = router;