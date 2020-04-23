var express = require("express");
var router = express.Router();
var Shop = require('../../models/shopModel/shop');
var Order = require("../../models/shopModel/testing/betaOrder");
var Customer = require("../../models/shopModel/shopCustomer");
var Invoice = require("../../models/shopModel/testing/betaInvoice");
var Vehicle = require("../../models/shopModel/vehicle");
var Representative = require("../../models/shopModel/representative");
var {isLoggedIn} = require('../../functionality/login');
var Appointment = require("../../models/shopModel/testing/betaAppointment");
var Quote = require("../../models/shopModel/testing/quote");
var faker = require('faker');
var async = require('async');

//FAKE DATA ROUTE FOR CUSTOMER AND VEHICLE - Don't delete!!!!!

// router.route('/fake')
//     .get(isLoggedIn, function (req, res) {
//         var user = req.user;
//         Shop.findById(user._id)
//             .populate("customer")
//             .exec(function (err, shop) {
//                 var make = ["Ferrari", "Porsche", "Honda", "Jaguar", "Ford"];
//                 var model = ["Italia", "911", "Accord", "F-Type", "GT"];
//                 var year = ["2011", "1990", "2002", "2017", "2018"];
//                 var license = ["NoNeed", "Rockstar", "CarmaGuys", "Refresh", "Zen"];
//
//                 for (var i = 0; i < 2100; i++) {
//                     var newVehicle = new Vehicle({
//                         make: make[i % 5],
//                         model: model[i % 5],
//                         year: year[i % 5],
//                         mileage: i + 14353,
//                         VIN: i,
//                         license: license[i % 5]
//                     });
//                     var newCustomer = new Customer({
//                         firstName: faker.name.firstName(),
//                         lastName: faker.name.lastName(),
//                         email: faker.internet.email(),
//                         phone: 9231234567 + i,
//                         address: faker.address.streetName(),
//                         city: faker.address.city(),
//                         state: faker.address.state(),
//                         zip: faker.address.zipCode(),
//                         vehicles: [],
//                         balance: 0
//                     });
//                     newCustomer.vehicles.push(newVehicle);
//                     user.customer.push(newCustomer);
//                     newVehicle.save(function (err, upVehicle) {
//                         if (err) console.log("cannot save vehicle");
//                     });
//                     newCustomer.save(function (err, updated) {
//                         user.save(function (err) {
//                             if (err) {
//                                 console.log("could not save");
//                             }
//                         });
//                     });
//                 }
//                 res.redirect("/shop/" + req.user._id + "/customer");
//             });
//     })
//     .post(isLoggedIn, function (req, res) {
//         var user = req.user;
//         Shop.findById(user._id)
//             .populate("customer")
//             .exec(function (err, shop) {
//                 var make = ["Ferrari", "Porsche", "Honda", "Jaguar", "Ford"];
//                 var model = ["Italia", "911", "Accord", "F-Type", "GT"];
//                 var year = ["2011", "1990", "2002", "2017", "2018"];
//                 var license = ["NoNeed", "Rockstar", "CarmaGuys", "Refresh", "Zen"];
//
//                 for (var i = 0; i < 1; i++) {
//                     var newVehicle = new Vehicle({
//                         make: make[i % 5],
//                         model: model[i % 5],
//                         year: year[i % 5],
//                         mileage: i + 14353,
//                         VIN: i,
//                         license: license[i % 5]
//                     });
//                     var newCustomer = new Customer({
//                         firstName: faker.name.firstName(),
//                         lastName: faker.name.lastName(),
//                         email: faker.internet.email(),
//                         phone: 9843932193,
//                         address: faker.address.streetName(),
//                         city: faker.address.city(),
//                         state: faker.address.state(),
//                         zip: faker.address.zipCode(),
//                         vehicles: [],
//                         balance: 0
//                     });
//                     newCustomer.vehicles.push(newVehicle);
//                     user.customer.push(newCustomer);
//                     newVehicle.save(function (err, upVehicle) {
//                         if (err) console.log("cannot save vehicle");
//                     });
//                     newCustomer.save(function (err, updated) {
//                         user.save(function (err) {
//                             if (err) {
//                                 console.log("could not save");
//                             }
//                         });
//                     });
//                 }
//                 res.redirect("/shop/" + req.user._id + "/customer");
//             });
//     });

//  customer
router.route(["/", "/:cid", "/add"])
    .get(isLoggedIn, function (req, res) {
        //for customer main page
        if (req.url == "/") {
            Shop.findOne({_id: req.user._id})
                .populate('customer')
                .exec(function (err, ourShop) {
                    if (ourShop.customer === undefined || ourShop.customer.length === 0) {
                        return res.render("shop-customer", {
                            user: ourShop
                        });
                    }
                    var i = 0;
                    async.waterfall([
                        //get total balance due for each customer
                        function getBalance(callback) {
                            ourShop.customer.forEach(function (customer) {
                                Invoice.aggregate([
                                    {"$match": {"customer": customer._id}},
                                    {
                                        "$group": {
                                            _id: customer._id,
                                            amount: {$sum: "$remaining"}
                                        }
                                    }
                                ], function (err, invoices) {
                                    Customer.findById(customer._id, function (err, curr) {
                                        curr.balance = invoices[0] === undefined ? 0 : invoices[0].amount / 100;
                                        curr.save(function (err) {
                                            i++;
                                            if (i === ourShop.customer.length) {
                                                callback();
                                            }
                                        });
                                    });
                                });
                            });
                        }
                    ], function (err, result) {
                        Shop.findOne({_id: req.user._id})
                            .populate({
                                path: 'customer',
                                model: 'ShopCustomer',
                                populate: {
                                    path: 'vehicles',
                                    model: 'Vehicle'
                                }
                            })
                            .exec(function (err, shop) {
                                return res.render("shop-customer", {
                                    user: shop
                                });
                            });
                    });
                });
            //add customer page render
        } else if (req.url == "/add") {
            res.render("shop-customer-add.ejs", {
                user: req.user
            });
        } else {
            //individual customer page
            Customer.findOne({_id: req.params.cid})
                .populate('vehicles')
                .populate('representatives')
                .exec(function (err, result) {
                    Order.find({'customer': req.params.cid})
                        .populate('vehicle')
                        .populate('service')
                        .exec(function (err, orders) {
                            Invoice.find({'customer': req.params.cid})
                                .populate('vehicle')
                                .populate('service')
                                .exec(function (err, invoices) {
                                    res.render("shop-customer-detail.ejs", {
                                        user: req.user,
                                        customer: result,
                                        invoices: invoices,
                                        orders: orders
                                    });
                                });
                        });
                });
        }
    })
    .post(isLoggedIn, function (req, res) {
        //add new customer
        var user = req.user;
        Shop.findById(user._id)
            .populate("customer")
            .exec(function (err, shop) {
                async.waterfall([checkPhone,
                    checkName], function (err, result) {
                    if (err) {
                        console.log("some error checking phone and number");
                    }
                    if (!result) {
                        if (req.body.accountType === 'personal') {
                            var newCustomer = new Customer({
                                accountType: req.body.accountType,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                phone: req.body.phone1 + req.body.phone2 + req.body.phone3,
                                address: req.body.street,
                                city: req.body.city,
                                state: req.body.state,
                                zip: req.body.zip,
                                vehicles: []
                            });
                            user.customer.push(newCustomer);
                            newCustomer.save(function (err, updated) {
                                user.save(function (err) {
                                    return res.redirect("/shop/" + req.user._id + "/customer/" + updated._id + "/vehicle");
                                });
                            });
                        } else {
                            var newCustomer = new Customer({
                                accountType: req.body.accountType,
                                companyName: req.body.companyName,
                                email: req.body.email,
                                phone: req.body.phone1 + req.body.phone2 + req.body.phone3,
                                address: req.body.street,
                                city: req.body.city,
                                state: req.body.state,
                                zip: req.body.zip,
                                vehicles: []
                            });
                            user.customer.push(newCustomer);
                            newCustomer.save(function (err, updated) {
                                user.save(function (err) {
                                    return res.redirect("/shop/" + req.user._id + "/customer/" + updated._id + "/vehicle");
                                });
                            });
                        }
                    }
                });

                //phone clash check
                function checkPhone(callback) {
                    var toReturn = false;
                    if (req.body.phone1 != '' && req.body.phone2 != '' && req.body.phone3 != '') {
                        Customer.find({"phone": req.body.phone1 + req.body.phone2 + req.body.phone3}, function (err, customers) {
                            var result = shop.customer.filter(function (a) {
                                return customers.some(function (b) {
                                    return JSON.stringify(a.phone) === JSON.stringify(b.phone);
                                });
                            });
                            if (result.length != 0) {
                                //change this to show dialog
                                toReturn = true;
                                (function renderPage() {
                                    res.render('shop-customer-clash.ejs', {
                                        user: req.user,
                                        id: result[0]._id,
                                        firstName: result[0].firstName,
                                        lastName: result[0].lastName,
                                        phone: result[0].phone,
                                        address: result[0].address
                                    });
                                    callback(null, toReturn);
                                })();
                            } else {
                                callback(null, false);
                            }
                        });
                    } else {
                        callback(null, false);
                    }
                }

                //name clash check
                function checkName(value, callback) {
                    if (!value) {
                        Customer.find({
                            "firstName": req.body.firstName,
                            "lastName": req.body.lastName
                        }).collation({locale: "en", strength: 2})
                            .exec(function (err, customers) {
                                var result = shop.customer.filter(function (a) {
                                    return customers.some(function (b) {
                                        return (JSON.stringify(a.firstName) === JSON.stringify(b.firstName) &&
                                            JSON.stringify(a.lastName) === JSON.stringify(b.lastName));
                                    });
                                });
                                if (result.length !== 0) {
                                    //show the dialog box on the page
                                    value = true;
                                    (function renderPage() {
                                        res.render('shop-customer-clash.ejs', {
                                            user: req.user,
                                            id: result[0]._id,
                                            firstName: result[0].firstName,
                                            lastName: result[0].lastName,
                                            phone: result[0].phone,
                                            address: result[0].address
                                        });
                                        callback(null, value);
                                    })();
                                } else {
                                    callback(null, value);
                                }
                            });
                    } else {
                        callback(null, value);
                    }
                }
            });
    })
    //edit a customer routes
    .put(isLoggedIn, function (req, res) {
        var type = req.body.type;
        switch (type) {
            case "firstname":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"firstName": req.body.firstName}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "lastname":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"lastName": req.body.lastName}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "companyname":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"companyName": req.body.companyName}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "address":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"address": req.body.address}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "city":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"city": req.body.city}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "state":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"state": req.body.state}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "zip":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"zip": req.body.zip}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "phone":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"phone": req.body.Phone}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "email":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"email": req.body.email}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "notes":
                Customer.findOneAndUpdate({_id: req.params.cid},
                    {"$set": {"notes": req.body.notes}})
                    .exec(function (err, customer) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
        }
    })
    //delete customer
    .delete(isLoggedIn, function (req, res) {
        Customer.findById(req.params.cid, function (err, customer) {
            Shop.update(
                {_id: req.user._id},
                {"$pull": {"customer": req.params.cid}},
                (err, result) => {
                    Invoice.remove({'customer': req.params.cid}, function (err) {
                        Order.remove({'customer': req.params.cid}, function (err) {
                            Appointment.remove({'customer': req.params.cid}, function (err) {
                                Quote.remove({'customer': req.params.cid}, function (err) {
                                    Vehicle.remove({_id: {$in: customer.vehicles}}, function (err) {
                                        Customer.remove({_id: req.params.cid}, function (err) {
                                            return res.send(req.protocol + '://' + req.get('host') + "/shop/" + req.user._id + "/customer");
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
        });
    });

//  vehicle
router.route(["/:cid/vehicle/:vid", "/:cid/vehicle", "/:cid/vehicle/:vid/history", "/:cid/vehicle/:vid/order"])
    .get(isLoggedIn, function (req, res) {
        if (req.url.includes("history")) {
            Vehicle.findById(req.params.vid, function (err, vehicle) {
                Order.find({'vehicle': req.params.vid})
                    .populate('vehicle')
                    .populate('service')
                    .exec(function (err, orders) {
                        res.render("shop-vehicle-history.ejs", {
                            user: req.user,
                            orders: orders,
                            vc: (vehicle.make + ' ' + vehicle.model + ', ' + vehicle.year)
                        });
                    });
            });
        } else if (req.url.includes("order")) {
            Vehicle.findById(req.params.vid, function (err, vehicle) {
                Order.find({'vehicle': req.params.vid})
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
                            console.log(foundOrder);
                            Shop.findById(req.user._id)
                                .populate('job')
                                .exec(function (err, shop) {
                                    res.render("active-orders.ejs", {
                                        user: req.user,
                                        order: foundOrder,
                                        job: shop.job,
                                        vc: (vehicle.make + ' ' + vehicle.model + ', ' + vehicle.year)
                                    });
                                });
                        }
                    });
            });
        } else {
            res.render("shop-vehicle-add", {
                cid: req.params.cid,
                user: req.user
            })
        }
    })
    .post(isLoggedIn, function (req, res) {
        var car = new Vehicle({
            make: req.body.make,
            model: req.body.model,
            year: req.body.year,
            mileage: req.body.mileage,
            license: req.body.license,
            VIN: req.body.vin
        });
        car.save(function (err) {
            Customer.findOneAndUpdate({_id: req.params.cid},
                {"$push": {vehicles: car}})
                .exec(function (err, book) {
                    return res.redirect('/shop/' + req.user._id + '/customer/' + req.params.cid);
                });
        });
    })
    .put(isLoggedIn, function (req, res) {
        var type = req.body.type;
        switch (type) {
            case "make":
                Vehicle.findOneAndUpdate({_id: req.params.vid},
                    {"$set": {"make": req.body.Make}})
                    .exec(function (err, vehicle) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "model":
                Vehicle.findOneAndUpdate({_id: req.params.vid},
                    {"$set": {"model": req.body.Model}})
                    .exec(function (err, vehicle) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "year":
                Vehicle.findOneAndUpdate({_id: req.params.vid},
                    {"$set": {"year": req.body.Year}})
                    .exec(function (err, vehicle) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "mileage":
                Vehicle.findOneAndUpdate({_id: req.params.vid},
                    {"$set": {"mileage": req.body.Mileage}})
                    .exec(function (err, vehicle) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "VIN":
                Vehicle.findOneAndUpdate({_id: req.params.vid},
                    {"$set": {"VIN": req.body.VIN}})
                    .exec(function (err, vehicle) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
            case "license":
                Vehicle.findOneAndUpdate({_id: req.params.vid},
                    {"$set": {"license": req.body.License}})
                    .exec(function (err, vehicle) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            return res.send("success");
                        }
                    });
                break;
        }
    })
    .delete(isLoggedIn, function (req, res) {
        Vehicle.remove({_id: req.params.vid}, function (err) {
            Customer.update(
                {_id: req.params.cid},
                {"$pull": {"vehicles": req.params.vid}},
                (err, result) => {
                    Invoice.remove({'vehicle': req.params.vid}, function (err) {
                        Order.remove({'vehicle': req.params.vid}, function (err) {
                            Appointment.remove({'vehicle': req.params.vid}, function (err) {
                                Quote.remove({'vehicle': req.params.vid}, function (err) {
                                    return res.send("success");
                                })
                            });
                        });
                    });
                });
        });
    });

//  representatives
router.route("/:cid/rep")
    .post(isLoggedIn, function (req, res) {
        var rep = new Representative({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            desc: req.body.desc
        });
        rep.save(function (err) {
            Customer.findById(req.params.cid, function (err, customer) {
                customer.representatives.push(rep);
                customer.save(function (err) {
                    res.send("success");
                });
            });
        });
    })
    .put(isLoggedIn, function (req, res) {

    })
    .delete(isLoggedIn, function (req, res) {
        Customer.update({_id: req.params.cid}, {"$pull": {"representatives": req.body.id}}, (err, result) => {
            Representative.remove({_id: req.body.id}, function (err) {
                res.send("success");
            });
        });
    });

//  note
router.route("/:cid/note")
    .post(isLoggedIn, function (req, res) {
        var info = req.body.note;
        Customer.findOneAndUpdate({_id: req.params.cid},
            {"$push": {notes: info}})
            .exec(function (err, book) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    res.redirect('/shop/' + req.user._id + '/customer/' + req.params.cid);
                }
            });
    })
    .delete(isLoggedIn, function (req, res) {
        Customer.findOneAndUpdate({_id: req.params.cid},
            {"$pull": {"notes": req.body.content}})
            .exec(function (err, book) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else {
                    return res.send("success");
                }
            });
    });

//  for data table use only
router.get('/:cid/vehicle/:vid/history/get', isLoggedIn, function (req, res) {
    Invoice.find({'vehicle': req.params.vid, 'status': true})
        .populate('vehicle')
        .populate('service')
        .exec(function (err, invoice) {
            res.send(invoice);
        });
});

router.get('/:cid/vehicle/:vid/order/get', isLoggedIn, function (req, res) {
    Order.find({'vehicle': req.params.vid, 'status': false})
        .populate('vehicle')
        .populate('service')
        .exec(function (err, order) {
            res.send(order);
        });
});

module.exports = router;
