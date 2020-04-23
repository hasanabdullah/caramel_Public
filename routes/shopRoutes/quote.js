var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Service = require("../../models/shopModel/service");
var BetaOrder = require("../../models/shopModel/testing/betaOrder");
var Vehicle = require("../../models/shopModel/vehicle");
var Customer = require("../../models/shopModel/shopCustomer");
var Issue = require("../../models/shopModel/issue");
var Quote = require("../../models/shopModel/testing/quote");
var BetaInvoice = require('../../models/shopModel/testing/betaInvoice');
var sgTransport = require('nodemailer-sendgrid-transport');
var nodemailer = require('nodemailer');
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var pdf = require('html-pdf');
var {isLoggedIn} = require('../../functionality/login');
var mkdirp = require('mkdirp');
var multer = require('multer');

router.route('/')
    .get(isLoggedIn, function (req, res) {
        var user = req.user;
        Quote.find({"shop": req.user._id})
            .populate('shop')
            .populate('vehicle')
            .populate('service')
            .populate('customer')
            .exec(function (err, quotes) {
                if (err) console.log("Could not get quotes");
                console.log(quotes[0]);
                res.render("quotes.ejs", {
                    user: user,
                    quotes: quotes
                });
            });
    });

router.get('/:oid', isLoggedIn, function (req, res) {
    var user = req.user;
    Quote.findById(req.params.oid)
        .populate('shop')
        .populate('vehicle')
        .populate('service')
        .populate('customer')
        .populate('order')
        .exec(function (err, quotes) {
            if (err) console.log("Could not get quotes");
            console.log(quotes[0]);
            res.render("quote-template", {
                user: user,
                quote: quotes
            });
        });
});

module.exports = router;