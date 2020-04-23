var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var {isLoggedIn} = require('../../functionality/login');

// =============================================================================
// SHOW ROUTE
// =============================================================================
router.get("/", isLoggedIn, function (req, res) {
    res.render('shop-home-calendar.ejs', {
        user: req.user
    });
});


module.exports = router;
