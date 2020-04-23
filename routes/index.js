var express = require("express");
var router = express.Router();
var passport = require('passport');

// =============================================================================
// Landing Page
// =============================================================================
router.get("/", function (req, res) {
    res.render("index.ejs");
});

// =============================================================================
// Register
// =============================================================================
router.get("/customer-register", function (req, res) {
    res.render("customer-register.ejs");
});

router.get("/shop-register", function (req, res) {
    res.render("shop-register.ejs", {
        message: req.flash("signupMessage")[0]
    });
});

router.post('/shop-register', passport.authenticate('shop-signup', {
    successRedirect: '/shop-login', // redirect to the secure profile section
    failureRedirect: '/shop-register', // redirect back to the signup page if there is an error
    failureFlash: true, // allow flash messages
    successFlash: "Please check your email"
}));

router.post('/customer-register', passport.authenticate('customer-signup', {
    successRedirect: '/customer-login', // redirect to the secure profile section
    failureRedirect: '/customer-register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// =============================================================================
// Login
// =============================================================================
router.get("/customer-login", function (req, res) {
    res.render("customer-login.ejs");
});

router.get("/shop-login", function (req, res) {
    res.render("shop-login.ejs", {
        message: req.flash("loginMessage")[0],
        success: req.flash("success")[0]
    });
});

router.post('/shop-login', function (req, res, next) {
    passport.authenticate('shop-login', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            //authentication failed
            return res.redirect("/shop-login");
        }
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.redirect("/shop/" + req.user._id + "/profile");
        });
    })(req, res, next);
});

router.post("/facebook-login", function (req, res, next) {
    passport.authenticate('facebook-login', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            //authentication failed
            return res.redirect('/customer-login');
        }
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            res.send(user);
        });
    })(req, res, next);
});


router.post('/customer-login', function (req, res, next) {
    passport.authenticate('customer-login', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        if (!user) {
            //authentication failed
            return res.redirect('/customer-login');
        }
        // ***********************************************************************
        // "Note that when using a custom callback, it becomes the application's
        // responsibility to establish a session (by calling req.login()) and send
        // a response."
        // Source: http://passportjs.org/docs
        // ***********************************************************************
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            res.redirect('/customer/' + req.user._id + '/profile');
        });
    })(req, res, next);
});

// =============================================================================
// Logout
// =============================================================================
router.get('/cusLogout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/customer-login');
        }
    });
});
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/shop-login');
        }
    });
});

module.exports = router;
