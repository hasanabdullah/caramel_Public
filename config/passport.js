// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var Customer = require('../models/customerModel/customer');
var Shop = require('../models/shopModel/shop');
var sgTransport = require('nodemailer-sendgrid-transport');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var ejs = require("ejs");
var path = require("path");
mongodb = require("mongodb");
MongoClient = mongodb.MongoClient;
FacebookStrategy=require('passport-facebook').Strategy;

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize and deserialize the user for the session
    passport.serializeUser(function (user, done) {
        if (user instanceof Customer) {
            done(null, {id: user.id, type: "Customer"});
        }
        else {
            done(null, {id: user.id, type: "Shop"});
        }
    });

    passport.deserializeUser(function (user, done) {
        if (user.type == "Customer") {
            Customer.findById(user.id, function (err, user) {
                done(err, user);
            });
        }
        else {
            Shop.findById(user.id, function (err, user) {
                done(err, user);
            });
        }
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('customer-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                Customer.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    // all is well, return user
                    else {
                        if (user.activated) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, req.flash('loginMessage', 'Oops! Not activated yet.'));
                        }
                    }
                });
            });

        }));

        passport.use('facebook-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'fakeKey',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, fakeKey, done) {
            process.nextTick(function () {
                Customer.findOne({'email': email}, function (err, user) {
                    return done(null, user);
                });
            });
            }));
       


    

    passport.use('shop-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                Shop.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    // all is well, return user
                    else {
                        if (user.activated) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, req.flash('loginMessage', 'Oops! Not activated yet.'));
                        }
                    }
                });
            });

        }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('customer-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                Customer.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // create the user
                        crypto.randomBytes(20, function (err, buf) {
                            var token = buf.toString('hex');
                            var newUser = new Customer();
                            newUser.email = email;
                            newUser.password = newUser.generateHash(password);
                            newUser.activateToken = token;
                            newUser.save(function (err) {
                                if (err)
                                    return done(err);
                                else {
                                    ejs.renderFile(path.join(__dirname, "../views/template/activation-email-template.ejs"), {email: 'http://' + req.headers.host + '/activate/customer/' + token}, function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var options = {
                                                auth: {
                                                    api_user: 'lkljty',
                                                    api_key: 'Cxh12345.'
                                                }
                                            };
                                            var client = nodemailer.createTransport(sgTransport(options));
                                            var emailContent = {
                                                from: 'activation@demo.com',
                                                to: email,
                                                subject: 'Account activation',
                                                html: data
                                            };
                                            client.sendMail(emailContent, function (err, info) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    return done(null, newUser);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }));

    passport.use('shop-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function () {
                Shop.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // create the user
                        crypto.randomBytes(20, function (err, buf) {
                            var token = buf.toString('hex');
                            var newUser = new Shop();
                            newUser.email = email;
                            newUser.password = newUser.generateHash(password);
                            newUser.activateToken = token;
                            newUser.save(function (err) {
                                if (err)
                                    return done(err);
                                else {
                                    ejs.renderFile(path.join(__dirname, "../views/template/activation-email-template.ejs"), {email: 'http://' + req.headers.host + '/activate/shop/' + token}, function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var options = {
                                                auth: {
                                                    api_user: 'lkljty',
                                                    api_key: 'Cxh12345.'
                                                }
                                            };
                                            var client = nodemailer.createTransport(sgTransport(options));
                                            var emailContent = {
                                                from: 'activation@demo.com',
                                                to: email,
                                                subject: 'Account activation',
                                                html: data
                                            };
                                            client.sendMail(emailContent, function (err, info) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    return done(null, newUser);
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    }
                });
            });
        }));
};
