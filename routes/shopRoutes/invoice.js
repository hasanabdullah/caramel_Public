var express = require("express");
var router = express.Router();
var Invoice = require("../../models/shopModel/testing/betaInvoice");
var Customer = require("../../models/shopModel/shopCustomer");
var Vehicle = require("../../models/shopModel/vehicle");
var Order = require("../../models/shopModel/testing/betaOrder");
var sgTransport = require('nodemailer-sendgrid-transport');
var nodemailer = require('nodemailer');
var {isLoggedIn} = require('../../functionality/login');
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var pdf = require('html-pdf');

//invoice tab
router.route('/')
    .get(isLoggedIn, function (req, res) {
        var user = req.user;
        Invoice.find({"shop": req.user._id})
            .populate('shop')
            .populate('vehicle')
            .populate('service')
            .populate('customer')
            .exec(function (err, invoices) {
                if (err) console.log("Could not get invoices");
                res.render("shop-invoice.ejs", {
                    user: user,
                    invoices: invoices
                });
            });
    });

//  send reminder to customer
router.post("/:id/remind/:cmail", isLoggedIn, function (req, res) {
    Invoice.findById(req.params.id)
        .populate('customer')
        .populate('vehicle')
        .populate('service')
        .exec(function (err, invoice) {
            ejs.renderFile(path.join(__dirname, "../../views/template/invoice-template.ejs"),
                {user: req.user, invoice: invoice},
                function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var options = {
                            format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                            orientation: "portrait"
                        };
                        pdf.create(data, options).toFile('./invoice/invoice' + invoice.dateCreated + '.pdf', function (err, result) {
                            if (err) return console.log(err);
                            //console.log(res);
                            var options = {
                                auth: {
                                    api_user: 'lkljty',
                                    api_key: 'Cxh12345.'
                                }
                            };
                            var client = nodemailer.createTransport(sgTransport(options));
                            var email = {
                                from: 'invoicereminder@demo.com',
                                to: req.params.cmail,
                                subject: 'Payment reminder',
                                text: 'Invoice reminder from caramel',
                                attachments: [{
                                    path: './invoice/invoice' + invoice.dateCreated + '.pdf'
                                }]
                            };
                            client.sendMail(email, function (err, info) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    invoice.lastMailDate = new Date();
                                    invoice.save(function (err) {
                                        fs.unlink('./invoice/invoice' + invoice.dateCreated + '.pdf', (err) => {
                                            if (err) throw err;
                                            res.redirect('/shop/' + req.user._id + '/invoice/' + req.params.id);
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
        });
});

//  print
router.route("/:id/print")
    .get(isLoggedIn, function (req, res) {
        Invoice.findById(req.params.id)
            .populate('customer')
            .populate('vehicle')
            .populate('service')
            .exec(function (err, invoice) {
                res.render('invoice-template.ejs', {
                    user: req.user,
                    invoice: invoice
                });
            });
    })
    .post(isLoggedIn, function (req, res) {
        Invoice.findById(req.params.id)
            .populate('customer')
            .populate('vehicle')
            .populate('service')
            .exec(function (err, invoice) {
                res.render('invoice-template.ejs', {
                    user: req.user,
                    invoice: invoice
                });
            });
    });

module.exports = router;
