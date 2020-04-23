var mongoose = require("mongoose");
mongoose.plugin(require('mongoose-regex-search'));

var quoteSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop'
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'ShopCustomer'
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    service: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Service'
    }],
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'BetaOrder'
    },
    dateCreated: {
        type: Date,
        default: new Date(),
        searchable: true
    },
    lastMailDate: {
        type: Date,
        searchable: true
    },
    hasUpload: {
        type: Boolean,
        default: false
    },
    uniqueId: String,
    fileName: String,
    amount: Number
});

module.exports = mongoose.model("Quote", quoteSchema);