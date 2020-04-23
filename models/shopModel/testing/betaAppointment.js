var mongoose = require("mongoose");

var betaAppointmentSchema = new mongoose.Schema({
    desc: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'ShopCustomer'
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vehicle'
    },
    technician: {
        type: mongoose.Schema.ObjectId,
        ref: 'Technician'
    },
    job: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Job'
    }],
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop'
    },
    lastModified: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("BetaAppointment", betaAppointmentSchema);
