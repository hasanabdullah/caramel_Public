module.exports = {
    display: function (section) {
        switch (section) {
            case "Customer details":
                var display = ["display:block", "display:none", "display:none", "display:none", "display:none"];
                return display;
            case "Vehicle details":
                var display = ["display:none", "display:block", "display:none", "display:none", "display:none"];
                return display;
            case "Repair Order details":
                var display = ["display:none", "display:none", "display:block", "display:none", "display:none"];
                return display;
            case "Invoice details":
                var display = ["display:none", "display:none", "display:none", "display:block", "display:none"];
                return display;
            case "Quote details":
                var display = ["display:none", "display:none", "display:none", "display:none", "display:block"];
                return display;
            default:
                var display = ["display:block", "display:block", "display:block", "display:block", "display:block"];
                return display;
        }
    },
    renderCustomer: function (shop, customer, res, option) {
        if (shop != undefined && customer != undefined) {
            var result = shop.customer.filter(function (a) {
                return customer.some(function (b) {
                    return JSON.stringify(a) === JSON.stringify(b);
                });
            });
            res.render("search", {
                display: module.exports.display(option),
                customer: result,
                vehicle: [],
                order: [],
                invoice: [],
                quote: []
            });
        } else {
            res.render("search", {
                display: module.exports.display(option),
                customer: [],
                vehicle: [],
                order: [],
                invoice: [],
                quote: []
            });
        }
    },
    renderVehicle: function (shop, vehicle, res, option) {
        if (shop != undefined && vehicle != undefined) {
            var merged = [];
            for (var i = 0; i < shop.customer.length; i++) {
                merged = merged.concat.apply(merged, shop.customer[i].vehicles);
            }
            var result = merged.filter(function (a) {
                return vehicle.some(function (b) {
                    return JSON.stringify(a) === JSON.stringify(b);
                });
            });
            res.render("search", {
                display: module.exports.display(option),
                customer: [],
                vehicle: result,
                order: [],
                invoice: [],
                quote: []
            });
        } else {
            res.render("search", {
                display: module.exports.display(option),
                customer: [],
                vehicle: [],
                order: [],
                invoice: [],
                quote: []
            });
        }
    },
    renderOrder: function (id, orders, res, option) {
        if (orders == undefined) {
            return res.render("search", {
                display: module.exports.display(option),
                customer: [],
                vehicle: [],
                order: [],
                invoice: [],
                quote: []
            });
        }
        var result = orders.filter(function (order) {
            return order.shop == id
        });
        res.render("search", {
            display: module.exports.display(option),
            customer: [],
            vehicle: [],
            order: result,
            invoice: [],
            quote: []
        });
    },
    renderInvoice: function (id, invoices, res, option) {
        if (invoices == undefined) {
            return res.render("search", {
                display: module.exports.display(option),
                customer: [],
                vehicle: [],
                order: [],
                invoice: [],
                quote: []
            });
        }
        var result = invoices.filter(function (invoice) {
            return invoice.shop == id
        });
        res.render("search", {
            display: module.exports.display(option),
            customer: [],
            vehicle: [],
            order: [],
            invoice: result,
            quote: []
        });
    },
    renderQuote: function (id, quotes, res, option) {
        if (quotes == undefined) {
            return res.render("search", {
                display: module.exports.display(option),
                customer: [],
                vehicle: [],
                order: [],
                invoice: [],
                quote: []
            });
        }
        var result = quotes.filter(function (quote) {
            return quote.shop == id
        });
        res.render("search", {
            display: module.exports.display(option),
            customer: [],
            vehicle: [],
            order: [],
            invoice: [],
            quote: result
        });
    },
    renderAll: function (id, res, option, shop, customer, vehicle, orders, invoices, quotes) {
        var customerResult = [], vehicleResult = [], ordersResult = [], invoicesResult = [], quotesResult = [];
        if (shop != undefined && customer != undefined) {
            customerResult = shop.customer.filter(function (a) {
                return customer.some(function (b) {
                    return JSON.stringify(a._id) === JSON.stringify(b._id);
                });
            });
        }
        if (shop != undefined && vehicle != undefined) {
            var merged = [];
            for (var i = 0; i < shop.customer.length; i++) {
                merged = merged.concat.apply(merged, shop.customer[i].vehicles);
            }
            vehicleResult = merged.filter(function (a) {
                return vehicle.some(function (b) {
                    return JSON.stringify(a) === JSON.stringify(b);
                });
            });
        }
        if (orders != undefined) {
            ordersResult = orders.filter(function (order) {
                return order.shop == id
            });
        }
        if (invoices != undefined) {
            invoicesResult = invoices.filter(function (invoice) {
                return invoice.shop == id
            });
        }
        if (quotes != undefined) {
            quotesResult = quotes.filter(function (quote) {
                return quote.shop == id
            });
        }
        res.render("search", {
            display: module.exports.display(option),
            customer: customerResult,
            vehicle: vehicleResult,
            order: ordersResult,
            invoice: invoicesResult,
            quote: quotesResult
        });
    }
};