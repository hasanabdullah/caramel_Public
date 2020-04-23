var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Job = require('../../models/shopModel/job');
var Technician = require('../../models/shopModel/technician');
var {isLoggedIn} = require('../../functionality/login');

// =============================================================================
// SHOW ROUTE
// =============================================================================

//  Jobs
router.route("/")
    .get(isLoggedIn, function (req, res) {
        Shop.findOne({_id: req.user._id})
            .populate('technician')
            .populate('job')
            .exec(function (err, result) {
                res.render('jobs.ejs', {
                    user: result
                });
            });
    });

router.route('/job')
    .post(isLoggedIn, function (req, res) {
        var user = req.user;
        var newJob = new Job({
            name: req.body.name,
            category: req.body.category,
            unitCost: req.body.unitCost
        });
        newJob.save(function (err) {
            user.job.push(newJob);
            user.save(function (err) {
                res.redirect("/shop/" + req.user._id + "/jobs");
            });
        });
    })
    .put(isLoggedIn, function (req, res) {
        var type = req.body.type;
        switch (type) {
            case "category":
                Job.findOneAndUpdate({_id: req.body.id},
                    {'category': req.body.category},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            res.send("success");
                        }
                    });
                break;
            case "name":
                Job.findOneAndUpdate({_id: req.body.id},
                    {'name': req.body.Name},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            res.send("success");
                        }
                    });
                break;
            case "cost":
                Job.findOneAndUpdate({_id: req.body.id},
                    {'unitCost': req.body.Cost},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            res.send("success");
                        }
                    });
                break;
        }
    })
    .delete(isLoggedIn, function (req, res) {
        Job.remove({_id: req.body.id}, function (err) {
            if (!err) {
                Shop.update(
                    {_id: req.user._id},
                    {"$pull": {"job": req.body.id}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to delete service.'});
                        }
                        res.send("success");
                    });
            }
        });
    });

module.exports = router;
