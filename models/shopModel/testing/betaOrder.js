var mongoose = require("mongoose");
mongoose.plugin(require('mongoose-regex-search'));

var betaOrderSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        default: new Date(),
        searchable: true
    },
    dateStarted: {
        type: Date,
        default: new Date(),
        searchable: true
    },
    dateEnded: {
        type: Date,
        searchable: true
    },
    service: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Service'
    }],
    status: {
        type: Boolean, //False is in progress
        //True is completed
        default: false
    },
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop'
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'ShopCustomer'
    },
    invoice: {
        type: mongoose.Schema.ObjectId,
        ref: 'BetaInvoice'
    },
    quote: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Quote'
    }],
    lastModified: {
        type: Date,
        default: new Date(),
        searchable: true
    },
    issue: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Issue'
    }],
    appointment: [{
        type: mongoose.Schema.ObjectId,
        ref: 'BetaAppointment'
    }],
    startMileage: {
        type: Number,
        searchable: true
    },
    endMileage: {
        type: Number,
        searchable: true
    },
    laborTax: {
        type: Number,
        default: 8
    },
    partsTax: {
        type: Number,
        default: 8
    },
    tags: {
        type: String,
        searchable: true
    },
    uniqueId: String
});

module.exports = mongoose.model("BetaOrder", betaOrderSchema);
