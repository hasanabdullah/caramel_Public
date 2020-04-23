var express = require("express");
var router = express.Router();
var Shop = require("../../models/shopModel/shop");
var Customer = require('../../models/shopModel/shopCustomer');
var Technician = require('../../models/shopModel/technician');
var BetaAppointment = require("../../models/shopModel/testing/betaAppointment");
var Job = require("../../models/shopModel/job");
var {isLoggedIn} = require('../../functionality/login');
var path = require('path');
var Vehicle = require("../../models/shopModel/vehicle");

// =============================================================================
// INDEX ROUTE
// =============================================================================

// =============================================================================
// SHOW ROUTE
// =============================================================================
router.get("/shop-appointments-calendar", isLoggedIn, function (req, res) {
    res.render("shop-appointments-calendar", {
        user: req.user
    })
})

router.get("/shop-calendar-add-appointment", isLoggedIn, function (req, res) {
    Shop.findById(req.user._id)
        .populate('technician')
        .populate('job')
        .populate('customer')
        .exec(function (err, shop) {
            res.render("shop-calendar-add-appointment", {
                user: shop
            });
        });
});

router.get('/shop-calendar-add-appointment/refreshVehicle', isLoggedIn, function (req, res) {
    Customer.findById(req.query.Customer)
        .populate("vehicles")
        .exec(function (err, customer) {
            res.send(customer.vehicles);
        });
});


// =============================================================================
// POST ROUTE FOR ADDING EVENT
// =============================================================================

router.get("/shop-calendar-add-appointment/addFromLocal", isLoggedIn, function (req, res) {
    //option tech
    if (req.query.tech == undefined) {
        Customer.findById(req.query.Customer, function (err, customer) {
            Vehicle.findById(req.query.Vehicle, function (err, vehicle) {
                var appt = new BetaAppointment({
                    desc: req.query.desc,
                    startDate: new Date(req.query.startTime),
                    endDate: new Date(req.query.endTime),
                    customer: customer,
                    vehicle: vehicle,
                    job: [],
                    shop: req.user
                });
                vehicle.apptStatus = true;
                vehicle.save(function (err) {
                    for (var i = 0; i < req.query.jobs.length; i++) {
                        Job.findById(req.query.jobs[i], function (err, job) {
                            appt.job.push(job);
                        });
                    }
                    appt.save(function (err) {
                        res.send(req.protocol + '://' + req.get('host') + "/shop/" + req.user._id + "/home");
                    });
                });
            });
        });
    } else {
        Technician.findById(req.query.tech, function (err, tech) {
            Customer.findById(req.query.Customer, function (err, customer) {
                Vehicle.findById(req.query.Vehicle, function (err, vehicle) {
                    var appt = new BetaAppointment({
                        desc: req.query.desc,
                        startDate: new Date(req.query.startTime),
                        endDate: new Date(req.query.endTime),
                        customer: customer,
                        vehicle: vehicle,
                        technician: tech,
                        job: [],
                        shop: req.user
                    });
                    vehicle.apptStatus = true;
                    vehicle.save(function (err) {
                        for (var i = 0; i < req.query.jobs.length; i++) {
                            Job.findById(req.query.jobs[i], function (err, job) {
                                appt.job.push(job);
                            });
                        }
                        appt.save(function (err) {
                            res.send(req.protocol + '://' + req.get('host') + "/shop/" + req.user._id + "/home");
                        });
                    });
                });
            });
        });
    }
});

router.get('/:cid/newAppt/:vid', isLoggedIn, function (req, res) {
    Shop.findById(req.user._id)
        .populate('technician')
        .populate('job')
        .exec(function (err, shop) {
            Customer.findById(req.params.cid, function (err, customer) {
                Vehicle.findById(req.params.vid, function (err, vehicle) {
                    res.render("shop-calendar-new-appointment", {
                        user: shop,
                        customer: customer,
                        vehicle: vehicle
                    });
                })
            });
        });
});


// =============================================================================
// DEMO CALENDAR FOR A WEEK
// =============================================================================
router.get("/demo/:day", isLoggedIn, function (req, res) {
    res.render("shop-demo-schedule-for-1day", {
        day: req.params.day
    });
});

module.exports = router;
