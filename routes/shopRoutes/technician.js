var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Job = require('../../models/shopModel/job');
var Technician = require('../../models/shopModel/technician');
var {isLoggedIn} = require('../../functionality/login');

// =============================================================================
// SHOW ROUTE
// =============================================================================

//  Technician
router.route("/")
    .get(isLoggedIn, function (req, res) {
        Shop.findOne({_id: req.user._id})
            .populate('technician')
            .populate('job')
            .exec(function (err, result) {
                res.render('technician.ejs', {
                    user: result
                });
            });
    });

router.route("/tech")
    .post(isLoggedIn, function (req, res) {
        var user = req.user;
        var tech = new Technician({
            name: req.body.name
        });
        tech.save(function (err) {
            user.technician.push(tech);
            user.save(function (err) {
                res.redirect("/shop/" + req.user._id + "/technician");
            });
        });
    })
    .put(isLoggedIn, function (req, res) {
        Technician.findOneAndUpdate({_id: req.body.id},
            {'name': req.body.Tech},
            (err, result) => {
                if (err) {
                    res.status(500)
                        .json({error: 'Unable to update technician.'});
                }
                else {
                    res.send("success");
                }
            });
    })
    .delete(isLoggedIn, function (req, res) {
        Technician.remove({_id: req.body.id}, function (err) {
            if (!err) {
                Shop.update(
                    {_id: req.user._id},
                    {"$pull": {"technician": req.body.id}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to delete vehicle.'});
                        }
                        res.send("success");
                    });
            }
        });
    });

module.exports = router;
