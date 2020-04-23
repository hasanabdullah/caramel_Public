var express = require("express");
var router = express.Router();
var path = require("path");
var Customer = require('../../models/customerModel/customer');
var mkdirp = require('mkdirp');
var multer = require('multer');
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var fs = require("fs");
var {isLoggedIn} = require('../../functionality/login');

// SHOW ROUTE
router.route("/")
    .get(isLoggedIn, function (req, res) {
        Customer.findById(req.user._id)
            .populate('vehicles')
            .exec(function (err, foundCustomer) {
                res.render("customer-profile", {
                    user: foundCustomer,
                });
            });
    })
    .post(isLoggedIn, function (req, res) {
        var folder = 'customers/' + req.user._id;
        var storage = multer.diskStorage({
            destination: folder,
            filename: function (req, file, cb) {
                cb(null, file.originalname);
            }
        });
        var upload = multer({
            storage: storage
        }).any();
        mkdirp(folder, function (err) {
            upload(req, res, function (err) {
                if (err) {
                    return res.end("Error uploading file.");
                } else {
                    res.redirect("/customer/" + req.user._id + "/profile");
                }
            });
        });
    });

router.get("/profile.js", function (request, response) {
    response.sendFile(path.join(__dirname, "../../public/javascripts/customer", "profile.js"));
});

router.get("/getProfile", function (request, response) {
    var id = request.user._id;
    var Customer = require("../../models/customerModel/customer");
    Customer.find({"_id": id})
        .exec(function (err, result) {
            response.json(result);
        });
});

router.get("/updateProfile/:name/:phone/:email/:address/:zip/:city/:state", function (request, response) {
    var id = request.user._id;
    var name = request.params.name;
    var phone = request.params.phone;
    var email = request.params.email;
    var address = request.params.address;
    var zip = request.params.zip;
    var city = request.params.city;
    var state = request.params.state;
    MongoClient.connect("mongodb://siyiz:carma2018@ds149960.mlab.com:49960/carma", {useNewUrlParser: true}, function (err, db) {
        if (err) {
            console.log("Unable to connect to the Server", err);
        } else {
            var db = db.db("carma");
            var collection = db.collection("customers");
            var newvalues = {
                $set: {
                    name: name,
                    phone: phone,
                    email: email,
                    address: address,
                    zip: zip,
                    city: city,
                    state: state
                }
            };
            collection.updateOne({_id: mongodb.ObjectId(id)}, newvalues, function (err, obj) {
                response.send("finish");
            });
        }
    });
});

module.exports = router;
