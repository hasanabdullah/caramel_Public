const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    port = process.env.PORT || 8080,
    passport = require("passport"),
    flash = require("connect-flash"),
    session = require("express-session"),
    path = require("path"),
    mongodb = require("mongodb"),
    MongoClient = mongodb.MongoClient,
    helmet = require('helmet'),
    expectCt = require('expect-ct'),
    fs = require("fs");
const Raven = require('raven');
Raven.config('https://f7971f6448c54e7a8f704c531b7b89a8@sentry.io/1260352').install();
app.use(Raven.requestHandler());
// ===========================================================================================
// Requiring ROUTES
// ===========================================================================================

// customerRoutes
const profileRoutes = require("./routes/customerRoutes/profile"),
    shopsRoutes = require("./routes/customerRoutes/shops"),
    friendRoutes = require("./routes/customerRoutes/friends"),
    uploadRoutes = require("./routes/customerRoutes/uploads");

// shopRoutes
const accountRoutes = require("./routes/shopRoutes/profile"),
    customerRoutes = require("./routes/shopRoutes/customer"),
    orderRoutes = require("./routes/shopRoutes/orders"),
    techRoutes = require("./routes/shopRoutes/technician"),
    jobRoutes = require("./routes/shopRoutes/jobs"),
    calendarRoutes = require("./routes/shopRoutes/calendar"),
    invoiceRoutes = require("./routes/shopRoutes/invoice"),
    homePage = require("./routes/shopRoutes/home"),
    searchRoutes = require("./routes/shopRoutes/search"),
    quoteRoutes = require("./routes/shopRoutes/quote"),
    vehiclesRoutes = require("./routes/shopRoutes/vehicles");


// requiring index route
const index = require("./routes/index"),
    reset = require("./routes/reset"),
    activate = require("./routes/activate");

// ===========================================================================================
// Config
// ===========================================================================================

require("./config/passport")(passport);
mongoose.connect("mongodb://siyiz:carma2018@ds149960.mlab.com:49960/carma", {useNewUrlParser: true});
// required for passport
app.use(session({
    secret: "nothing", // session secret
    resave: true,
    rolling: true,
    saveUninitialized: false,
    // cookie: {
    //     expires: 60 * 1000  //  auto log out after 1hr
    // }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(expectCt({
    enforce: true,
    maxAge: 123
}));
// app.use(function(req, res, next) {
//   var schema = req.headers['x-forwarded-proto'];
//
//   if (schema === 'https') {
//     // Already https; don't do anything special.
//     next();
//   }
//   else {
//     // Redirect to https.
//     res.redirect('https://' + req.headers.host + req.url);
//   }
// });

// ===========================================================================================
// Redirecting ROUTES
// ===========================================================================================

// index route
app.use("/", index);
// require('dotenv').config();
// console.log(process.env.foo);

//activate route
app.use("/activate", activate);

//reset route
app.use("/reset", reset);

// shops
app.use("/shop/:id/home", homePage);
app.use("/shop/:id/profile", accountRoutes);
app.use("/shop/:id/customer", customerRoutes);
app.use("/shop/:id/orders", orderRoutes);
app.use("/shop/:id/technician", techRoutes);
app.use("/shop/:id/jobs", jobRoutes);
app.use("/shop/:id/calendar", calendarRoutes);
app.use("/shop/:id/invoice", invoiceRoutes);
app.use("/shop/:id/search", searchRoutes);
app.use("/shop/:id/quote", quoteRoutes);
app.use("/shop/:id/vehicles", vehiclesRoutes);

// customer
app.use("/customer/:id/profile", profileRoutes);
app.use("/customer/:id/shops", shopsRoutes);
app.use("/customer/:id/friends", friendRoutes);
app.use("/customer/:id/uploads", uploadRoutes);

app.get("/calendar-tpls.js", function (request, response) {
    response.sendFile(path.join(__dirname, "views/calendar/dist/js", "calendar-tpls.js"));
});

app.get("/calendarDemoCtrl.js", function (request, response) {
    response.sendFile(path.join(__dirname, "views/calendar/demo", "calendarDemoCtrl.js"));
});

app.get("/calendar.min.css", function (request, response) {
    response.sendFile(path.join(__dirname, "views/calendar/dist/css", "calendar.min.css"));
});

app.get("/popup.css", function (request, response) {
    response.sendFile(path.join(__dirname, "views/calendar/dist/css", "popup.css"));
});

app.get("/shop/:id/details.html", function (request, response) {
    response.sendFile(path.join(__dirname, "views/calendar/demo", "details.html"));
});

app.get("/shop-home-calendar.ejs", function (request, response) {
    response.sendFile(path.join(__dirname, "views/shop-page", "shop-home-calendar.ejs"));
});

app.get("/shop/:id/home/data", function (request, response) {
    var id = request.params.id;
    var BetaAppointment = require("./models/shopModel/testing/betaAppointment");
    BetaAppointment.find({"shop": id})
        .populate("customer")
        .populate("vehicle")
        .exec(function (err, result) {
            response.json(result);
        });
});

app.get("/repairorder/:cid/:vid/:shop", function (request, response) {
    var BetaOrder = require("./models/shopModel/testing/betaOrder");
    var _id = new mongodb.ObjectId();
    var order = new BetaOrder({
        _id: _id,
        dateCreated: new Date(),
        shop: request.params.shop,
        vehicle: request.params.vid,
        customer: request.params.cid,
    });
    order.save(function (err, result) {
        console.log(_id);
        response.send(_id);
    });
});

app.get("/deleteappointment/:id", function (request, response) {
    var id = request.params.id;
    MongoClient.connect("mongodb://siyiz:carma2018@ds149960.mlab.com:49960/carma", {useNewUrlParser: true}, function (err, db) {
        if (err) {
            console.log("Unable to connect to the Server", err);
        } else {
            console.log("Connection established to the mongoDB");
            var db = db.db("carma");
            var collection = db.collection("betaappointments");
            collection.deleteOne({_id: mongodb.ObjectId(id)}, function (err, result) {
                response.send("finish");
            });
        }
    });
});

app.get("/changeappointment/:id/:description/:startTime/:endTime", function (request, response) {
    var id = request.params.id;
    MongoClient.connect("mongodb://siyiz:carma2018@ds149960.mlab.com:49960/carma", {useNewUrlParser: true}, function (err, db) {
        if (err) {
            console.log("Unable to connect to the Server", err);
        } else {
            console.log("Connection established to the mongoDB");
            var db = db.db("carma");
            var collection1 = db.collection("betaappointments");
            var newvalues1 = {
                $set: {
                    desc: request.params.description,
                    startDate: request.params.startTime,
                    endDate: request.params.endTime,
                    create: true
                }
            };
            collection1.updateOne({_id: mongodb.ObjectId(id)}, newvalues1, function (err, obj) {
                response.send("finish");
            });
        }
    });
});

app.get("/views/calendar/demo/index.html", function (request, response) {
    response.sendFile(path.join(__dirname, "views/calendar/demo", "index.html"));
});


// css
app.use(express.static(__dirname + "/public"));

// javascript
app.use("/public", express.static(__dirname + "/public"));

// images
app.use("/customersJpg", express.static(__dirname + "/customersJpg"));
app.use("/customersPdf", express.static(__dirname + "/customersPdf"));

//views
app.set("views", [__dirname + "/views",
    __dirname + "/views/customer-page",
    __dirname + "/views/shop-page",
    __dirname + "/views/template",
    __dirname + "/views/shop-page/customers",
    __dirname + "/views/shop-page/invoices",
    __dirname + "/views/shop-page/repairs",
    __dirname + "/views/shop-page/technicians",
    __dirname + "/views/shop-page/jobs",
    __dirname + "/views/shop-page/profile",
    __dirname + "/views/shop-page/quote",
    __dirname + "/views/shop-page/vehicles",
    __dirname + "/views/shop-page/search"
]);

//images
app.get("/logos/:name", function (request, response) {
    var exist = fs.existsSync(path.join(__dirname, "logos", request.params.name));
    if (exist == true) {
        response.sendFile(path.join(__dirname, "logos", request.params.name));
    } else {
        response.sendFile(path.join(__dirname, "views", "logo.jpg"));
    }
});

//taxes
app.get("/tax.js", function (request, response) {
    response.sendFile(path.join(__dirname, "public/javascripts/shop", "tax.js"));
});
app.get("/tax/:id", function (request, response) {
    var id = request.params.id;
    var BetaAppointment = require("./models/shopModel/testing/betaOrder");
    BetaAppointment.find({"_id": id})
        .exec(function (err, result) {
            response.json(result);
            //console.log(result);
        });
});

app.get("/tax/parts/:id/:tax", function (request, response) {
    var id = request.params.id;
    var tax = request.params.tax;
    MongoClient.connect("mongodb://siyiz:carma2018@ds149960.mlab.com:49960/carma", {useNewUrlParser: true}, function (err, db) {
        if (err) {
            console.log("Unable to connect to the Server", err);
        } else {
            var db = db.db("carma");
            var collection = db.collection("betaorders");
            var newvalues = {
                $set: {
                    partsTax: tax
                }
            };
            collection.updateOne({_id: mongodb.ObjectId(id)}, newvalues, function (err, obj) {
                response.send("finish");
            });
        }
    });
});

//facebook login
app.get("/fb-login.js", function (request, response) {
    response.sendFile(path.join(__dirname, "public/javascripts/customer", "fb-login.js"));
});
app.get("/facebook-check", function (request, response) {
    var fbId=request.query.fbId;
    var name=request.query.name;
    var email=request.query.email;
    MongoClient.connect("mongodb://siyiz:carma2018@ds149960.mlab.com:49960/carma", {useNewUrlParser: true}, function (err, db) {
        if (err) {
            console.log("Unable to connect to the Server", err);
        } else {
            var db = db.db("carma");
            var collection = db.collection("customers");
            collection.findOne({email: email}, function (err, result) {
                if (result==null){
                    var newCustomer = { email:email,fbId: fbId, name:name };
                    collection.insertOne(newCustomer, {getLastError:1},function (err, result) {
                        console.log(err);
                        response.send(result);
                    });
                }else{
                    var myquery = { email: email };
                    var newvalues = { $set: {fbId: fbId} };
                    collection.updateOne(myquery, newvalues, function(err, res) {
                    response.send(res);
                });
                }
            });
        }
    });
});

app.listen(port, function () {
});