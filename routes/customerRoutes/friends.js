var express = require("express");
var router = express.Router();
var Customer = require('../../models/customerModel/customer');
var {isLoggedIn} = require('../../functionality/login');

router.route("/")
    .get(isLoggedIn, function (req, res) {
        res.render('customer-friends', {user: req.user});
    })
    .post(isLoggedIn, function (req, res) {

    });

router.route("/:fid")
    .get(isLoggedIn, function (req, res) {

    })
    .delete(isLoggedIn, function (req, res) {

    });

module.exports = router;