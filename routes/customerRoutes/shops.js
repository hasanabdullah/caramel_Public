var express = require("express");
var router = express.Router();
var Customer = require('../../models/customerModel/customer');
var Shop = require('../../models/shopModel/shop');
var {isLoggedIn} = require('../../functionality/login');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCgvQjVl2Fh5x5uTkGfAcleQRogkxFvBEo'
});
var async = require('async');
var Google = require('../../models/customerModel/googleReference');
var distance = require('google-distance-matrix');
distance.key('AIzaSyCgvQjVl2Fh5x5uTkGfAcleQRogkxFvBEo');

router.route("/")
    .get(isLoggedIn, function (req, res) {
        res.render('customer-shop', {
            user: req.user,
            results: [],
            message: "Enter address",
            location: undefined
        });
    })
    .post(isLoggedIn, function (req, res) {
        googleMapsClient.geocode({
            address: req.body.address
        }, function (err, response) {
            if (!err && response.json.status !== "ZERO_RESULTS") {
                var location = response.json.results[0].geometry.location;
                googleMapsClient.placesNearby({
                    location: response.json.results[0].geometry.location,
                    radius: 5000,
                    type: 'car_repair'
                }, function (err, response) {
                    if (!err && response.json.results.length !== 0) {
                        var i = 0;
                        response.json.results.forEach(function (ref) {
                            var newRef = new Google({
                                gid: ref.place_id,
                                name: ref.name,
                                vicinity: ref.vicinity
                            });
                            newRef.save(function (err) {
                                i++;
                                if (i === response.json.results.length) {
                                    res.render('customer-shop', {
                                        user: req.user,
                                        results: response.json.results,
                                        message: "Success",
                                        location: location
                                    });
                                }
                            });
                        });
                    } else {
                        res.render('customer-shop', {
                            user: req.user,
                            results: [],
                            message: "Places Not Found",
                            location: location
                        });
                    }
                });
            } else {
                res.render('customer-shop', {
                    user: req.user,
                    results: [],
                    message: "Places Not Found",
                    location: undefined
                });
            }
        });
    });

router.route("/:fid")
    .get(isLoggedIn, function (req, res) {
        Google.findOne({gid: req.params.fid}, function (err, ref) {
           res.send(ref);
        });
    })
    .post(isLoggedIn, function (req, res) {

    })
    .delete(isLoggedIn, function (req, res) {

    });

module.exports = router;
