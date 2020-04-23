var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Service = require("../../models/shopModel/service");
var BetaOrder = require("../../models/shopModel/testing/betaOrder");
var Vehicle = require("../../models/shopModel/vehicle");
var Customer = require("../../models/shopModel/shopCustomer");
var Issue = require("../../models/shopModel/issue");
var Quote = require("../../models/shopModel/testing/quote");
var BetaInvoice = require('../../models/shopModel/testing/betaInvoice');
var {isLoggedIn} = require('../../functionality/login');
var mkdirp = require('mkdirp');
var multer = require('multer');
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var pdf = require('html-pdf');
var sgTransport = require('nodemailer-sendgrid-transport');
var nodemailer = require('nodemailer');

//  order
router.route(["/", "/:cid/newOrder/:vid", "/searchOrder"])
    .get(isLoggedIn, function (req, res) {
        if (req.url.includes("searchOrder")) {
            BetaOrder.find({
                "shop": req.user._id,
                "customer": req.query.Customer,
                "vehicle": req.query.Vehicle,
                "status": false
            }).populate()
                .exec(function (err, orders) {
                    res.send(orders);
                });
        } else {
            BetaOrder.find({"shop": req.user._id})
                .populate('customer')
                .populate('vehicle')
                .exec(function (err, result) {
                    Shop.findById(req.user._id)
                        .populate('job')
                        .populate('customer')
                        .exec(function (err, shop) {
                            res.render("repair-order.ejs", {
                                user: shop,
                                order: result
                            });
                        });
                });
        }
    })
    .post(isLoggedIn, function (req, res) {
        if (req.url == "/") {
            Customer.findById(req.body.Customer, function (err, customer) {
                Vehicle.findById(req.body.Vehicle, function (err, vehicle) {
                    vehicle.lastInDate = new Date();
                    vehicle.save(function (err) {
                        var order = new BetaOrder({
                            shop: req.user,
                            vehicle: vehicle,
                            customer: customer,
                            uniqueId: req.body.uniqueId,
                            dateCreated: new Date()
                        });
                        order.save(function (err, updated) {
                            return res.send(req.protocol + '://' + req.get('host') + "/shop/" + req.user._id + "/orders/" + updated._id);
                        });
                    });
                });
            });
        } else {
            Shop.findById(req.user._id, function (err, shop) {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var yearMonth;
                var uniqueId;
                var lastYear;
                var lastMonth;
                var lastNumber;
                if (month > 9) {
                    yearMonth = year.toString().substring(2, 4) + month.toString();
                } else {
                    yearMonth = year.toString().substring(2, 4) + "0" + month.toString();
                }
                lastYear = shop.lastYear;
                lastMonth = shop.lastMonth;
                lastNumber = shop.lastNumber;
                if (year != lastYear) {
                    lastYear = year;
                    lastNumber = 0;
                } else {
                    if (month != lastMonth) {
                        lastMonth = month;
                        lastNumber = 0;
                    } else {
                        lastNumber = shop.lastNumber + 1;
                    }
                }
                if (lastNumber < 10) {
                    uniqueId = yearMonth + "0000" + lastNumber.toString();
                } else if (10 <= lastNumber < 100) {
                    uniqueId = yearMonth + "000" + lastNumber.toString();
                } else if (100 <= lastNumber < 1000) {
                    uniqueId = yearMonth + "00" + lastNumber.toString();
                } else if (1000 <= lastNumber < 10000) {
                    uniqueId = yearMonth + "0" + lastNumber.toString();
                } else {
                    uniqueId = yearMonth + lastNumber.toString()
                }
                Shop.findOneAndUpdate({"_id": req.user._id}, {
                    "$set": {
                        "lastYear": lastYear,
                        "lastMonth": lastMonth,
                        "lastNumber": lastNumber
                    }
                })
                    .exec(function (err, result) {
                        Customer.findById(req.params.cid, function (err, customer) {
                            Vehicle.findById(req.params.vid, function (err, vehicle) {
                                vehicle.lastInDate = new Date();
                                vehicle.save(function (err) {
                                    var order = new BetaOrder({
                                        shop: req.user,
                                        vehicle: vehicle,
                                        customer: customer,
                                        uniqueId: uniqueId,
                                        dateCreated: new Date()
                                    });
                                    order.save(function (err, updated) {
                                        return res.redirect("/shop/" + req.user._id + "/orders/" + updated._id);
                                    });
                                });
                            });
                        });
                    });

            });
        }
    })
    .put(isLoggedIn, function (req, res) {
        Customer.findById(req.body.Customer)
            .populate("vehicles")
            .exec(function (err, customer) {
                return res.send(customer.vehicles);
            });
    });

//  service
router.route(["/:oid/service", "/:oid", "/:oid/service/:sid"])
    .get(isLoggedIn, function (req, res) {
        BetaOrder.findById(req.params.oid)
            .populate('vehicle')
            .populate('customer')
            .populate("service")
            .populate("issue")
            .populate("quote")
            .populate('invoice')
            .exec(function (err, foundOrder) {
                if (err) {
                    console.log(err);
                } else {
                    Shop.findById(req.user._id)
                        .populate('job')
                        .populate('technician')
                        .exec(function (err, shop) {
                            res.render("repair-order-details", {
                                user: req.user,
                                order: foundOrder,
                                job: shop.job,
                                technician: shop.technician
                            });
                        });
                }
            });
    })
    .put(isLoggedIn, function (req, res) {
        var type = req.body.type;
        switch (type) {
            case "name":
                Service.update({_id: req.params.sid},
                    {$set: {name: req.body.Name}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            // case "technician":
            //     Service.update({_id: req.params.sid},
            //         {$set: {technician: req.body.Technician}},
            //         (err, result) => {
            //             if (err) {
            //                 res.status(500)
            //                     .json({error: 'Unable to update service.'});
            //             }
            //             else {
            //                 BetaOrder.findById(req.params.oid, function (err, order) {
            //                     order.lastModified = new Date();
            //                     order.save(function (err) {
            //                         res.send("success");
            //                     });
            //                 });
            //             }
            //         });
            //     break;
            case "quan":
                Service.update({_id: req.params.sid},
                    {$set: {quantity: req.body.Quan}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "cost":
                Service.update({_id: req.params.sid},
                    {$set: {unitCost: req.body.Cost}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "category":
                Service.update({_id: req.params.sid},
                    {$set: {category: req.body.Category}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "source":
                Service.update({_id: req.params.sid},
                    {$set: {source: req.body.Source}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service (source of part).'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "issueNum":
                Service.update({_id: req.params.sid},
                    {$set: {issueNumber: req.body.IssueNum}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "technician":
                Service.update({_id: req.params.sid},
                    {$set: {technician: req.body.Technician}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "dateStarted":
                BetaOrder.findById(req.params.oid, function (err, order) {
                    order.dateStarted = new Date(req.body.dateStarted);
                    order.lastModified = new Date();
                    order.save(function (err) {
                        res.send("success");
                    });
                });
                break;
            case "dateEnded":
                BetaOrder.findById(req.params.oid, function (err, order) {
                    order.dateEnded = new Date(req.body.dateEnded);
                    order.lastModified = new Date();
                    order.save(function (err) {
                        res.send("success");
                    });
                });
                break;
            case "startMileage":
                BetaOrder.findById(req.params.oid, function (err, order) {
                    order.startMileage = req.body.startMileage;
                    order.lastModified = new Date();
                    order.save(function (err) {
                        res.send("success");
                    });
                });
                break;
            case "endMileage":
                BetaOrder.findById(req.params.oid, function (err, order) {
                    order.endMileage = req.body.endMileage;
                    order.lastModified = new Date();
                    order.save(function (err) {
                        res.send("success");
                    });
                });
                break;
            case "status":
                if (req.body.status.includes("Closed")) {
                    BetaOrder.findById(req.params.oid, function (err, order) {
                        order.status = true;
                        order.lastModified = new Date();
                        order.save(function (err) {
                            return res.send("success");
                        });
                    });
                } else {
                    BetaOrder.findById(req.params.oid, function (err, order) {
                        order.status = false;
                        order.lastModified = new Date();
                        order.save(function (err) {
                            return res.send("success");
                        });
                    });
                }
                break;
        }
    })
    .post(isLoggedIn, function (req, res) {
        var newService = new Service({
            name: req.body.jobInput,
            category: req.body.category,
            source: req.body.source,
            unitCost: req.body.unitCost,
            quantity: req.body.quantity,
            issueNumber: req.body.issueNumber,
            technician: req.body.technician
        });
        BetaOrder.findById(req.params.oid, function (err, foundOrder) {
            if (!err) {
                newService.save(function (err) {
                    foundOrder.lastModified = new Date();
                    foundOrder.service.push(newService);
                    foundOrder.save(function (err) {
                        res.send("success");
                    });
                });
            }
        });
    })
    .delete(isLoggedIn, function (req, res) {
        Service.remove({_id: req.body.id}, function (err) {
            if (!err) {
                BetaOrder.findByIdAndUpdate(
                    req.params.oid,
                    {
                        "$pull": {"service": req.body.id},
                        "$set": {"lastModifieed": new Date()}
                    },
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to delete service.'});
                        } else {
                            res.send("success");
                        }
                    });
            }
        });
    });

//issue
router.route(["/:oid/issue", "/:oid/issue/:iid"])
    .post(isLoggedIn, function (req, res) {
        var issue = new Issue({
            complaint: req.body.complaint,
            cause: req.body.cause,
            correction: req.body.correction
        });
        issue.save(function (err, updated) {
            BetaOrder.findById(req.params.oid, function (err, order) {
                order.issue.push(updated);
                order.save(function (err) {
                    res.send("success");
                });
            });
        });
    })
    .put(isLoggedIn, function (req, res) {
        var type = req.body.type;
        switch (type) {
            case "complaint":
                Issue.update({_id: req.params.iid},
                    {$set: {complaint: req.body.Complaint}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "cause":
                Issue.update({_id: req.params.iid},
                    {$set: {cause: req.body.Cause}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
            case "correction":
                Issue.update({_id: req.params.iid},
                    {$set: {correction: req.body.Correction}},
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to update service.'});
                        }
                        else {
                            BetaOrder.findById(req.params.oid, function (err, order) {
                                order.lastModified = new Date();
                                order.save(function (err) {
                                    res.send("success");
                                });
                            });
                        }
                    });
                break;
        }
    })
    .delete(isLoggedIn, function (req, res) {
        Issue.remove({_id: req.body.id}, function (err) {
            if (!err) {
                BetaOrder.findByIdAndUpdate(
                    req.params.oid,
                    {
                        "$pull": {"issue": req.body.id},
                        "$set": {"lastModifieed": new Date()}
                    },
                    (err, result) => {
                        if (err) {
                            res.status(500)
                                .json({error: 'Unable to delete issue.'});
                        } else {
                            res.send("success");
                        }
                    });
            }
        });
    });

//quote
router.route(["/:oid/quote", "/:oid/quote/:qid", "/:oid/quote/:qid/upload"])
    .get(isLoggedIn, function (req, res) {
        Quote.findById(req.params.qid)
            .populate('customer')
            .populate('shop')
            .populate('vehicle')
            .populate('service')
            .populate('order')
            .exec(function (err, quote) {
                BetaOrder.findById(quote.order, function (err, order) {
                    res.render("quote-template", {
                        quote: quote,
                        order: order
                    });
                });
            });
    })
    .post(isLoggedIn, function (req, res) {
        if (req.url.includes("upload")) {
            var folder = 'uploads/' + req.user._id;
            var storage = multer.diskStorage({
                destination: folder,
                filename: function (req, file, cb) {
                    cb(null, file.originalname);
                }
            });
            var upload = multer({
                storage: storage
            }).single('quote');
            mkdirp(folder, function (err) {
                upload(req, res, function (err) {
                    if (err) {
                        return res.end("Error uploading file.");
                    } else {
                        // mimetype, originalname, size, path
                        Quote.findById(req.params.qid, function (err, quote) {
                            quote.hasUpload = true;
                            quote.fileName = req.file.path;
                            quote.save(function (err) {
                                return res.send("upload " + req.file.originalname);
                            });
                        });
                    }
                });
            });
        } else {
            BetaOrder.findById(req.params.oid, function (err, order) {
                var quote = new Quote({
                    shop: order.shop,
                    customer: order.customer,
                    service: order.service,
                    vehicle: order.vehicle,
                    amount: req.body.amount,
                    order: order,
                    uniqueId: order.uniqueId
                });
                quote.save(function (err, updated) {
                    order.quote.push(updated);
                    order.lastModified = new Date();
                    order.save(function (err) {
                        return res.send("success");
                    });
                });
            });
        }
    })
    .put(isLoggedIn, function (req, res) {
        Quote.findById(req.params.qid)
            .populate('customer')
            .populate('shop')
            .populate('vehicle')
            .populate('service')
            .populate('order')
            .exec(function (err, quote) {
                BetaOrder.findById(quote.order, function (err, order) {
                    ejs.renderFile(path.join(__dirname, "../../views/template/quote-template.ejs"),
                        {order: order, quote: quote},
                        function (err, data) {
                            var options = {
                                format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                                orientation: "portrait"
                            };
                            pdf.create(data, options).toFile('./quote/quote' + quote.dateCreated + '.pdf', function (err, result) {
                                var options = {
                                    auth: {
                                        api_user: 'lkljty',
                                        api_key: 'Cxh12345.'
                                    }
                                };
                                var client = nodemailer.createTransport(sgTransport(options));
                                var email = {
                                    from: 'dontreply@caramel.com',
                                    to: quote.customer.email,
                                    subject: 'Quote reminder',
                                    text: 'Quote reminder from caramel',
                                    attachments: [{
                                        path: './quote/quote' + quote.dateCreated + '.pdf'
                                    }]
                                };
                                client.sendMail(email, function (err, info) {
                                    fs.unlink('./quote/quote' + quote.dateCreated + '.pdf', (err) => {
                                        res.send("success");
                                    });
                                });
                            });
                        });
                });
            });
    })
    .delete(isLoggedIn, function (req, res) {
        Quote.remove({_id: req.params.qid}, function (err) {
            if (err) {
                console.log(err);
            } else {
                res.send("success");
            }
        });
    });

//note
router.route("/:oid/tag")
    .put(isLoggedIn, function (req, res) {
        BetaOrder.findById(req.params.oid, function (err, order) {
            order.tags = req.body.tags;
            order.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    return res.send("success");
                }
            });
        });
    })
    .delete(isLoggedIn, function (req, res) {
        BetaOrder.findById(req.params.oid, function (err, order) {
            order.tags = undefined;
            order.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    return res.send("success");
                }
            });
        });
    });

//invoice
router.route(["/:oid/invoice", "/:oid/payment/:pid", "/:oid/invoice/:invid", "/:oid/invoice/:invid/payment", "/:oid/invoice/add", "/:oid/invoice/update"])
    .get(isLoggedIn, function (req, res) {
        BetaInvoice.findById(req.params.invid)
            .populate('customer')
            .populate('shop')
            .populate('vehicle')
            .populate('service')
            .exec(function (err, invoice) {
                BetaOrder.findById(invoice.order, function (err, order) {
                    res.render("invoice-template", {
                        invoice: invoice,
                        order: order
                    });
                });
            });
    })
    .post(isLoggedIn, function (req, res) {
        if (req.url.includes("add")) {
            BetaOrder.findById(req.params.oid, function (err, order) {
                var invoice = new BetaInvoice({
                    shop: order.shop,
                    customer: order.customer,
                    service: order.service,
                    vehicle: order.vehicle,
                    status: false,
                    dateCreated: new Date(),
                    order: order,
                    amount: req.body.amount,
                    remaining: req.body.amount,
                    payment: [],
                    lastUpdated: new Date(),
                    uniqueId: order.uniqueId
                });
                invoice.save(function (err, updated) {
                    Vehicle.findById(order.vehicle, function (err, vehicle) {
                        vehicle.save(function (err) {
                            BetaOrder.findById(req.params.oid, function (err, elem) {
                                elem.invoice = updated;
                                elem.save(function (err) {
                                    return res.send("success");
                                });
                            });
                        });
                    });
                });
            });
        } else if (req.url.includes("update")) {
            BetaOrder.findById(req.params.oid, function (err, order) {
                BetaInvoice.findById(order.invoice._id, function (err, invoice) {
                    invoice.service = order.service;
                    var paid = invoice.amount - invoice.remaining;
                    invoice.amount = req.body.amount;
                    invoice.remaining = req.body.amount - paid;
                    invoice.lastUpdated = new Date();
                    invoice.save(function (err) {
                        if (!err) {
                            return res.send("success");
                        }
                    });
                });
            });
        } else if (req.url.includes("payment")) {
            BetaInvoice.findById(req.params.invid)
                .populate('customer')
                .populate('vehicle')
                .populate('service')
                .exec(function (err, invoice) {
                    invoice.remaining -= req.body.amount;
                    if (invoice.remaining <= 0) {
                        invoice.status = true;
                    }
                    invoice.lastUpdated = new Date();
                    var payment = {
                        amount: req.body.amount,
                        method: req.body.method
                    };
                    invoice.payment.push(payment);
                    invoice.save(function (err) {
                        if (err) {
                            console.log("problem saving invoice");
                        } else {
                            res.redirect("/shop/" + req.user._id + "/orders/" + req.params.oid);
                        }
                    });
                });
        }
    })
    .put(isLoggedIn, function (req, res) {
        BetaInvoice.findById(req.params.invid)
            .populate('customer')
            .populate('shop')
            .populate('vehicle')
            .populate('service')
            .exec(function (err, invoice) {
                BetaOrder.findById(invoice.order, function (err, order) {
                    ejs.renderFile(path.join(__dirname, "../../views/template/invoice-template.ejs"),
                        {order: order, invoice: invoice},
                        function (err, data) {
                            var options = {
                                format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                                orientation: "portrait"
                            };
                            pdf.create(data, options).toFile('./invoice/invoice' + invoice.dateCreated + '.pdf', function (err, result) {
                                if (err) return console.log(err);
                                var options = {
                                    auth: {
                                        api_user: 'lkljty',
                                        api_key: 'Cxh12345.'
                                    }
                                };
                                var client = nodemailer.createTransport(sgTransport(options));
                                var email = {
                                    from: 'dontreply@caramel.com',
                                    to: invoice.customer.email,
                                    subject: 'Invoice reminder',
                                    text: 'Invoice reminder from caramel',
                                    attachments: [{
                                        path: './invoice/invoice' + invoice.dateCreated + '.pdf'
                                    }]
                                };
                                client.sendMail(email, function (err, info) {
                                    fs.unlink('./invoice/invoice' + invoice.dateCreated + '.pdf', (err) => {
                                        res.send("success");
                                    });
                                });
                            });
                        });
                });
            });
    })
    .delete(isLoggedIn, function (req, res) {
        if (req.url.includes("payment")) {
            BetaOrder.findById(req.params.oid)
                .populate('customer')
                .populate('vehicle')
                .populate('service')
                .populate('invoice')
                .exec(function (err, order) {
                    BetaInvoice.findById(order.invoice._id)
                        .populate('payment')
                        .exec(function (err, invoice) {
                            var payment = invoice.payment.id(req.body.id);
                            var toAdd = parseFloat(payment.amount);
                            var rem = parseFloat(invoice.remaining);
                            var final = toAdd + rem;
                            invoice.remaining = final;
                            invoice.lastUpdated = new Date();
                            invoice.payment.id(req.body.id).remove();
                            invoice.save(function (err) {
                                if (err) {
                                    console.log('could not save invoice');
                                } else {
                                    res.redirect("/shop/" + req.user._id + "/orders/" + req.params.oid);
                                }
                            });
                        });
                });
        } else {
            BetaInvoice.findById(req.params.invid)
                .populate('customer')
                .populate('vehicle')
                .populate('service')
                .exec(function (err, invoice) {
                    BetaOrder.findById(invoice.order._id, function (err, order) {
                        order.lastModified = new Date();
                        order.invoice = undefined;
                        order.save(function (err) {
                            BetaInvoice.remove({_id: req.params.invid}, function (err) {
                                return res.send("success");
                            });
                        });
                    });
                });
        }
    });

//generateId
router.route("/generateId/:year")
    .post(isLoggedIn, function (req, res) {
        var shopId = req.user._id;
        Shop.find({"_id": shopId})
            .exec(function (err, result) {
                res.json(result);
            });
    });

router.route("/updateId/:year/:month/:number")
    .post(isLoggedIn, function (req, res) {
        var shopId = req.user._id;
        var lastYear = req.params.year;
        var lastMonth = req.params.month;
        var lastNumber = req.params.number;
        Shop.findOneAndUpdate({"_id": shopId}, {
            "$set": {
                "lastYear": lastYear,
                "lastMonth": lastMonth,
                "lastNumber": lastNumber
            }
        })
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.send("success");
                }
            });
    });

module.exports = router;
