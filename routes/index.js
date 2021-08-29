const router = require('express').Router();
const passport = require('passport');
const genPassword = require.main.require('./lib/passwordUtils').genPassword;
const confirmPassword = require.main.require('./lib/passwordUtils').confirmPassword;
const connection = require('../config/database');
const models = connection.models;
const isAuth = require('./authMiddleware').isAuth;

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/api/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('login failed: ' + req.session.passport.user);
            return res.status(401).send();
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            console.log('login successful: ' + req.session.passport.user);
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
        email: req.body.email,
        displayName: req.body.username
    });

    newUser.save((err) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }

        console.log('register successful: ' + req.body.username + "-" + req.body.email);
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

        console.log('room created successful: ' + newRoom);
        res.status(200).send();
    });

});

/**
 * -------------- PATCH ROUTES ----------------
 */

router.patch("/api/updateDisplayName", isAuth, (req, res, next) => {
    models.User.findByIdAndUpdate(req.session.passport.user, {displayName: req.body.displayName}, (err, doc) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        }

        console.log('updated display name successfully: ' + req.session.passport.user + "-" + req.body.displayName);
        res.status(200).send();
    })
});

router.patch("/api/updateEmail", isAuth, (req, res, next) => {
    confirmPassword(req.session.passport.user, req.body.confirmPassword).then((valid) => {
        if (valid) {
            models.User.findByIdAndUpdate(req.session.passport.user, {email: req.body.email}, (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                }

                console.log('updated email successfully: ' + req.session.passport.user + "-" + req.body.email);
                res.status(200).send();
            })
        } else {
            console.log("bad password from: " + req.session.passport.user)
            res.status(401).send();
        }
    })
});

router.patch("/api/updatePassword", isAuth, (req, res, next) => {
    confirmPassword(req.session.passport.user, req.body.currentPassword).then((valid) => {
        if (valid) {
            const saltHash = genPassword(req.body.updatedPassword);

            const salt = saltHash.salt;
            const hash = saltHash.hash;

            models.User.findByIdAndUpdate(req.session.passport.user, {salt: salt, hash: hash}, (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).send();
                }

                console.log('updated email successfully: ' + req.session.passport.user + "-")
                res.status(200).send();
            })
        } else {
            console.log("bad password from: " + req.session.passport.user)
            res.status(401).send();
        }
    })
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
    models.User.findById(req.session.passport.user)
        .then((userData) => {
            console.log("get userdata: " + userData._id + "-" + userData.username)

            if (!userData) {
                res.status(401).send();
            }

            res.json({
                username: userData.username,
                email: userData.email,
                displayName: userData.displayName
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
            }
        );
});

router.get('/api/validateMeeting/:link', isAuth, (req, res, next) => {
    models.UserRoom.findOne({ roomLink: req.params.link })
        .then((userRoom) => {
            if (!userRoom) {
                res.status(404).send();
            }

            console.log("validate meeting: " + req.params.link)
            res.status(200).send();
        })
        .catch((err) => {
            res.status(500).send();
            console.log(err);
            }
        );
});

router.get('/api/getHistory', isAuth, (req, res, next) => {
    models.UserRoom.find({ user: req.session.passport.user })
        .then((user) => {
            if (!user) {
                res.status(404).send();
            }

            console.log("get user history: " + req.session.passport.user)
            res.status(200).json(user);
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

    console.log("logged out successfully: " + req.session.passport.user)
    res.status(200).send();
});

module.exports = router;