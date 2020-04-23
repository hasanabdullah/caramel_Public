var csv = require('fast-csv');
var stream = fs.createReadStream("/path/to/filename");
var wrong = [];
var both = [];
csv
    .fromStream(stream, {headers: true})
    .transform(function (data, next) {
        if (data.FirstName === '' && data.LastName === '' && data.Company === '') {
            wrong.push(data);
            next();
        } else if ((data.FirstName !== '' || data.LastName !== '') && data.Company !== '') {
            both.push(data);
            next();
        } else if (data.Company !== '') {
            var phone = "";
            if (data.PhoneNum1 !== '') {
                phone = data.PhoneNum1;
            } else if (data.PhoneNum2 !== '') {
                phone = data.PhoneNum2;
            } else if (data.PhoneNum3 !== '') {
                phone = data.PhoneNum3;
            } else if (data.PhoneNum4 !== '') {
                phone = data.PhoneNum4;
            } else if (data.PhoneNum5 !== '') {
                phone = data.PhoneNum5;
            } else if (data.PhoneNum6 !== '') {
                phone = data.PhoneNum6;
            } else if (data.PhoneNum7 !== '') {
                phone = data.PhoneNum7;
            } else if (data.PhoneNum8 !== '') {
                phone = data.PhoneNum8;
            } else if (data.PhoneNum9 !== '') {
                phone = data.PhoneNum9;
            } else if (data.PhoneNum10 !== '') {
                phone = data.PhoneNum10;
            } else {
            }
            //company account
            Customer.findOne({
                companyName: data.Company
            }).exec(function (err, user) {
                if (user) {
                    console.log("skipped data " + JSON.stringify(data));
                    next();
                } //user already exists
                else {
                    var vehicle = new Vehicle({
                        make: data.Make,
                        model: data.Model,
                        year: data.Year,
                        engine: data.Engine.substring(0, data.Engine.indexOf(', VIN')),
                        license: data.License,
                        lastInDate: data.LastInDate,
                        inspDate: data.InspDate
                    });
                    vehicle.save(function (err) {
                        var newCustomer = new Customer({
                            companyName: data.Company,
                            email: data.Email,
                            address: data.Address,
                            phone: phone,
                            zip: data.ZipCode,
                            state: data.State,
                            city: data.City,
                            accountType: "company",
                            vehicles: [],
                            representatives: []
                        });
                        newCustomer.vehicles.push(vehicle);
                        newCustomer.save(function (err) {
                            Shop.findById("<shopid>", function (err, shop) {
                                shop.customer.push(newCustomer);
                                shop.save(function (err) {
                                    next();
                                });
                            });
                        });
                    });
                } //no users
            });
        } else {
            //personal account
            var phone = "";
            if (data.PhoneNum1 !== '') {
                phone = data.PhoneNum1;
            } else if (data.PhoneNum2 !== '') {
                phone = data.PhoneNum2;
            } else if (data.PhoneNum3 !== '') {
                phone = data.PhoneNum3;
            } else if (data.PhoneNum4 !== '') {
                phone = data.PhoneNum4;
            } else if (data.PhoneNum5 !== '') {
                phone = data.PhoneNum5;
            } else if (data.PhoneNum6 !== '') {
                phone = data.PhoneNum6;
            } else if (data.PhoneNum7 !== '') {
                phone = data.PhoneNum7;
            } else if (data.PhoneNum8 !== '') {
                phone = data.PhoneNum8;
            } else if (data.PhoneNum9 !== '') {
                phone = data.PhoneNum9;
            } else if (data.PhoneNum10 !== '') {
                phone = data.PhoneNum10;
            } else {
            }
            Customer.findOne({
                $and: [
                    {firstName: data.FirstName},
                    {lastName: data.LastName},
                ]
            }).exec(function (err, user) {
                if (user) {
                    console.log("skipped data " + JSON.stringify(data));
                    next();
                } //user already exists
                else {
                    var vehicle = new Vehicle({
                        make: data.Make,
                        model: data.Model,
                        year: data.Year,
                        engine: data.Engine.substring(0, data.Engine.indexOf(', VIN')),
                        license: data.License,
                        lastInDate: data.LastInDate,
                        inspDate: data.InspDate
                    });
                    vehicle.save(function (err) {
                        if (data.SpouseName !== '') {
                            var represent = new Representative({
                                name: data.SpouseName
                            });
                            represent.save(function (err) {
                                var newCustomer = new Customer({
                                    firstName: data.FirstName,
                                    lastName: data.LastName,
                                    email: data.Email,
                                    address: data.Address,
                                    phone: phone,
                                    zip: data.ZipCode,
                                    state: data.State,
                                    city: data.City,
                                    vehicles: [],
                                    representatives: []
                                });
                                newCustomer.vehicles.push(vehicle);
                                newCustomer.representatives.push(represent);
                                newCustomer.save(function (err) {
                                    Shop.findById("<shopid>", function (err, shop) {
                                        shop.customer.push(newCustomer);
                                        shop.save(function (err) {
                                            next();
                                        });
                                    });
                                });
                            });
                        } else {
                            var newCustomer = new Customer({
                                firstName: data.FirstName,
                                lastName: data.LastName,
                                email: data.Email,
                                address: data.Address,
                                zip: data.ZipCode,
                                phone: phone,
                                state: data.State,
                                city: data.City,
                                vehicles: [],
                                representatives: []
                            });
                            newCustomer.vehicles.push(vehicle);
                            newCustomer.save(function (err) {
                                Shop.findById("<shopid>", function (err, shop) {
                                    shop.customer.push(newCustomer);
                                    shop.save(function (err) {
                                        next();
                                    });
                                });
                            });
                        }
                    });
                } //no users
            });
        }
    })
    .on("end", function () {
        // for (var i = 0; i < wrong.length; i++) {
        //     console.log("No person and company name" + JSON.stringify(wrong[i]));
        // }
        // for (var i = 0; i < both.length; i++) {
        //     console.log("Both person and company name" + JSON.stringify(both[i]));
        // }
    });