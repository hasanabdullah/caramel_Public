var mongoose = require("mongoose");
var {getNumber, setNumber} = require('../../../functionality/number');
mongoose.plugin(require('mongoose-regex-search'));

var betaInvoiceSchema = new mongoose.Schema({
    service: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Service'
    }],
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
    status: {
        type: Boolean, //False is open; True is paid
        default: false
    },
    dateCreated: {
        type: Date,
        default: new Date(),
        searchable: true
    },
    amount: {
        type: Number,
        required: true,
        get: getNumber,
        set: setNumber,
        searchable: true
    },
    remaining: {
        type: Number,
        required: true,
        get: getNumber,
        set: setNumber,
        searchable: true
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'BetaOrder'
    },
    payment: [{
        amount: {
            type: Number,
            required: true,
            get: getNumber,
            set: setNumber,
            searchable: true
        },
        method: String
    }],
    payMethod: {
        type: String,
        searchable: true
    },
    lastMailDate: {
        type: Date,
        searchable: true
    },
    lastUpdated: {
        type: Date,
        searchable: true
    },
    uniqueId: String
});

module.exports = mongoose.model("BetaInvoice", betaInvoiceSchema);
