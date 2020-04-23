var express = require("express");
var router = express.Router();
var Customer = require('../models/customerModel/customer');
var Shop = require('../models/shopModel/shop');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var sgTransport = require('nodemailer-sendgrid-transport');
var ejs = require("ejs");
var fs = require("fs");
var path = require("path");
// =============================================================================
// Landing Page
// =============================================================================
router.route("/shop")
    .get(function (req, res) {
        res.render("reset.ejs", {
            type: "shop"
        });
    })
    .post(function (req, res) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                Shop.findOne({"email": req.body.email}, function (err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/reset');
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                ejs.renderFile(path.join(__dirname, "../views/template/reset-email-template.ejs"), {email: 'http://' + req.headers.host + '/reset/shop/' + token}, function (err, data) {
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
                        var email = {
                            from: 'passwordreset@demo.com',
                            to: req.body.email,
                            subject: 'Password Reset',
                            html: data
                        };
                        client.sendMail(email, function (err, info) {
                            if (err) {
                                console.log(error);
                            }
                            else {
                                res.redirect('/');
                            }
                        });
                    }
                });
            }], function (err) {
            if (err) return next(err);
            res.redirect('/');
        });
    });

router.route("/shop/:token")
    .get(function (req, res) {
        Shop.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }, function (err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/reset/shop');
            }
            res.render('forgot', {
                token: req.params.token,
                user: req.user,
                type: "shop"
            });
        });
    })
    .post(function (req, res) {
        async.waterfall([
            function (done) {
                Shop.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {$gt: Date.now()}
                }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        console.log("not found");
                        return res.redirect('back');
                    }
                    user.password = bcrypt.hashSync(req.body.newpassword, bcrypt.genSaltSync(8), null);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.activated = true;
                    user.save(function (err) {
                        if (err) return handleError(err)
                        else res.redirect('/');
                    });
                });
            }
        ], function (err) {
            res.redirect('/');
        });
    });

router.route("/customer")
    .get(function (req, res) {
        res.render("reset.ejs", {
            type: "customer"
        });
    })
    .post(function (req, res) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                Customer.findOne({"email": req.body.email}, function (err, user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/reset');
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                ejs.renderFile(path.join(__dirname, "../views/template/reset-email-template.ejs"), {email: 'http://' + req.headers.host + '/reset/customer/' + token}, function (err, data) {
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
                        var email = {
                            from: 'passwordreset@demo.com',
                            to: req.body.email,
                            subject: 'Password Reset',
                            html: data
                        };
                        client.sendMail(email, function (err, info) {
                            if (err) {
                                console.log(error);
                            }
                            else {
                                res.redirect('/');
                            }
                        });
                    }
                });
            }], function (err) {
            if (err) return next(err);
            res.redirect('/');
        });
    });

router.route("/customer/:token")
    .get(function (req, res) {
        Customer.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: Date.now()}
        }, function (err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/reset/customer');
            }
            res.render('forgot', {
                token: req.params.token,
                user: req.user,
                type: "customer"
            });
        });
    })
    .post(function (req, res) {
        async.waterfall([
            function (done) {
                Customer.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {$gt: Date.now()}
                }, function (err, user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        console.log("not found");
                        return res.redirect('back');
                    }
                    user.password = bcrypt.hashSync(req.body.newpassword, bcrypt.genSaltSync(8), null);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.activated = true;
                    user.save(function (err) {
                        if (err) return handleError(err)
                        else res.redirect('/');
                    });
                });
            }
        ], function (err) {
            res.redirect('/');
        });
    });

module.exports = router;
