var express = require("express");
var router = express.Router();
var Customer = require('../models/customerModel/customer');
var Shop = require('../models/shopModel/shop');

router.get('/shop/:token', function (req, res) {
    Shop.findOne({"activateToken": req.params.token}, function (err, shop) {
        if (err) {
            console.log(err);
        }
        else {
            shop.activated = true;
            shop.activateToken = undefined;
            shop.save(function (err) {
                if (err) return handleError(err);
                else res.redirect('/');
            });
        }
    });
});

router.get('/customer/:token', function (req, res) {
    Customer.findOne({"activateToken": req.params.token}, function (err, customer) {
        if (err) {
            console.log(err);
        }
        else {
            customer.activated = true;
            customer.activateToken = undefined;
            customer.save(function (err) {
                if (err) return handleError(err);
                else res.redirect('/');
            });
        }
    });
});

module.exports = router;
