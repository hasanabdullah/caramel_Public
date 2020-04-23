var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var {isLoggedIn} = require('../../functionality/login');

router.route('/')
    .get(isLoggedIn, function (req, res) {
        Shop.findById(req.user._id)
            .populate({
                path: "customer",
                populate: {
                    path: "vehicles"
                }
            })
            .exec(function (err, shop) {
                res.render("shop-vehicles", {
                    user: shop
                });
            });
    });

module.exports = router;