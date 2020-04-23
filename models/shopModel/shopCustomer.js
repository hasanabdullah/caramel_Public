var mongoose = require('mongoose');
var {getNumber, setNumber} = require('../../functionality/number');
mongoose.plugin(require('mongoose-regex-search'));

var shopCustomerSchema = mongoose.Schema({
    firstName: {
        type: String,
        searchable: true
    },
    lastName: {
        type: String,
        searchable: true
    },
    email: {
        type: String,
        searchable: true
    },
    address: {
        type: String,
        searchable: true
    },
    zip: {
        type: String,
        searchable: true
    },
    state: {
        type: String,
        searchable: true
    },
    city: {
        type: String,
        searchable: true
    },
    phone: {
        type: String,
        searchable: true
    },
    vehicles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    }],
    notes: {
        type: String,
        searchable: true
    },
    accountType: {
        type: String,
        required: true,
        default: "personal",
        searchable: true
    },
    balance: {
        type: Number,
        get: getNumber,
        set: setNumber,
        default: 0
    },
    companyName: {
        type: String,
        searchable: true
    },
    representatives: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Representative'
    }]
});

module.exports = mongoose.model('ShopCustomer', shopCustomerSchema);
