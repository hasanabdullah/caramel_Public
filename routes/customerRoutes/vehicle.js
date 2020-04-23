var express = require("express");
var router = express.Router();
var Customer = require('../../models/customerModel/customer');
var Vehicle = require("../../models/shopModel/vehicle");
var {isLoggedIn} = require('../../functionality/login');
router.get('/', isLoggedIn, function (req, res) {
    // res.render('customer-vehicle.ejs', {
    //     user: req.user
    // });
});
//ADD
router.post('/add', isLoggedIn, function (req, res) {
    var user = req.user;
    var newVehicle = new Vehicle({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        VIN: req.body.VIN,
        mileage: req.body.mileage,
        license: req.body.license,
        engine: req.body.engine
    });
    newVehicle.save(function (err) {
        user.vehicles.push(newVehicle);
        user.save(function (err) {
            res.redirect("/customer/" + req.user._id + "/profile");
        });
    });
});
//EDIT
router.post('/:vid/edit', isLoggedIn, function (req, res) {
    Vehicle.findOneAndUpdate({_id: req.params.vid},
        {
            $set:
                {
                    VIN: req.body.VIN,
                    model: req.body.model,
                    make: req.body.make,
                    year: req.body.year,
                    mileage: req.body.mileage,
                    license: req.body.license,
                    engine: req.body.engine
                }
        },
        (err, result) => {
            if (err) {
                res.status(500)
                    .json({error: 'Unable to update service.'});
            }
            res.redirect('/customer/' + req.user._id + '/profile');
        });
});
//DELETE
router.post('/:vid/delete', isLoggedIn, function (req, res) {
    Vehicle.remove({_id: req.params.vid}, function (err) {
        if (!err) {
            Customer.findByIdAndUpdate(
                req.params.vid,
                {
                    "$pull": {"vehicles": req.params.vid}
                },
                (err, result) => {
                    if (err) {
                        res.status(500)
                            .json({error: 'Unable to delete service.'});
                    } else {
                        res.redirect('/customer/' + req.user._id + '/profile');
                    }
                });
        }
    });
});

module.exports = router;