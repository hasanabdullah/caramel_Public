var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Customer = require('../../models/shopModel/shopCustomer');
var Vehicle = require('../../models/shopModel/vehicle');
var Order = require('../../models/shopModel/testing/betaOrder');
var Invoice = require('../../models/shopModel/testing/betaInvoice');
var Quote = require('../../models/shopModel/testing/quote');
var {isLoggedIn} = require('../../functionality/login');
var Search = require('../../functionality/search');

router.route("/")
    .post(isLoggedIn, function (req, res) {
        switch (req.body.option) {
            case "Customer details":
                Customer.search(req.body.search, function (err, customer) {
                    Shop.findById(req.user._id)
                        .populate('customer')
                        .exec(function (err, shop) {
                            return Search.renderCustomer(shop, customer, res, req.body.option);
                        });
                });
                break;
            case "Vehicle details":
                Vehicle.search(req.body.search, function (err, vehicle) {
                    Shop.findById(req.user._id)
                        .populate({
                            path: 'customer',
                            select: 'vehicles',
                            populate: {
                                path: 'vehicles'
                            }
                        }).exec(function (err, shop) {
                        return Search.renderVehicle(shop, vehicle, res, req.body.option);
                    });
                });
                break;
            case "Repair Order details":
                Order.search(req.body.search, function (err, orders) {
                    return Search.renderOrder(req.user._id, orders, res, req.body.option);
                });
                break;
            case "Invoice details":
                Invoice.search(req.body.search, function (err, invoices) {
                    return Search.renderInvoice(req.user._id, invoices, res, req.body.option);
                });
                break;
            case "Quote details":
                Quote.search(req.body.search, function (err, quotes) {
                    return Search.renderQuote(req.user._id, quotes, res, req.body.option);
                });
                break;
            default:
                Customer.search(req.body.search, function (err, customer) {
                    Vehicle.search(req.body.search, function (err, vehicle) {
                        Shop.findById(req.user._id)
                            .populate({
                                path: 'customer',
                                select: 'vehicles',
                                populate: {
                                    path: 'vehicles'
                                }
                            }).exec(function (err, shop) {
                            Order.search(req.body.search, function (err, orders) {
                                Invoice.search(req.body.search, function (err, invoices) {
                                    Quote.search(req.body.search, function (err, quotes) {
                                        return Search.renderAll(req.user._id, res, req.body.option, shop, customer, vehicle, orders, invoices, quotes);
                                    });
                                });
                            });
                        });
                    });
                });
                break;
        }
    });

module.exports = router;