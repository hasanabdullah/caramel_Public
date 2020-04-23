var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Invoice = require('../../models/shopModel/testing/betaInvoice');
var BetaOrder = require('../../models/shopModel/testing/betaOrder');
var {isLoggedIn} = require('../../functionality/login');
var mkdirp = require('mkdirp');
var multer = require('multer');
var fs = require("fs");
var path = require("path");

// =============================================================================
// SHOW ROUTE
// =============================================================================

//  Shop Owner
router.route("/")
    .get(isLoggedIn, function (req, res) {
        Shop.findOne({_id: req.user._id})
            .populate('technician')
            .populate('job')
            .exec(function (err, result) {
                BetaOrder.find({"shop": req.user._id})
                    .populate('customer')
                    .populate('vehicle')
                    .exec(function (err, order) {
                        Invoice.find({
                            shop: req.user._id,
                            status: false
                        }).populate('customer')
                            .populate('vehicle')
                            .exec(function (err, unpaidInvoices) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.render('shop-profile.ejs', {
                                        order: order,
                                        user: result,
                                        invoices: unpaidInvoices
                                    });
                                }
                            });
                    });
            });
    })
    .put(isLoggedIn, function (req, res) {
        var user = req.user;
        var type = req.body.type;
        switch (type) {
            case "password":
                if (req.body.password != "") {
                    Shop.findById(user._id, function (err, elem) {
                        if (err) return handleError(err);
                        elem.password = user.generateHash(req.body.password);
                        elem.save(function (err, updatedElem) {
                            if (err) return handleError(err);
                        });
                    });
                }
                if (req.body.password != "") {
                    res.send(req.protocol + '://' + req.get('host') + "/shop-login");
                } else {
                    res.send(req.protocol + '://' + req.get('host') + "/shop/" + req.user._id + "/profile");
                }
                break;
            case "bay":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.bayNumber = req.body.Bay;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
            case "name":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.name = req.body.Name;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
            case "phone":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.phone = req.body.Phone;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
            case "address":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.address = req.body.Address;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
            case "city":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.city = req.body.City;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
            case "state":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.state = req.body.State;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
            case "zip":
                Shop.findById(req.user._id, function (err, elem) {
                    if (err) return handleError(err);
                    elem.zip = req.body.Zip;
                    elem.save(function (err, updatedElem) {
                        if (err) return handleError(err);
                        else return res.send("success");
                    });
                });
                break;
        }
    });


router.route(["/upload"])
    .post(isLoggedIn, function (req, res) {
        var folder = 'logos';
        var storage = multer.diskStorage({
            destination: folder,
            filename: function (req, file, cb) {
                //cb(null, req.user._id+"."+file.originalname.split(".").pop());
                cb(null, req.user._id + ".jpg");
            }
        });
        var upload = multer({
            storage: storage
        }).single('photo');
        mkdirp(folder, function (err) {
            upload(req, res, function (err) {
                if (err) {
                    return res.end("Error uploading file.");
                } else {
                    return res.redirect('/shop/' + req.user._id + "/profile");
                }
            });
        });
    });

router.route(["/delete"])
    .post(isLoggedIn, function (req, res) {
        console.log(req.user._id + ".jpg");
        console.log(path.join(__dirname, "../../logos", req.user._id + ".jpg"));
        var exist = fs.existsSync(path.join(__dirname, "../../logos", req.user._id + ".jpg"));
        console.log(exist);
        if (exist == true) {
            fs.unlinkSync(path.join(__dirname, "../../logos", req.user._id + ".jpg"));
            return res.redirect('/shop/' + req.user._id + "/profile");
        }
    })

module.exports = router;
