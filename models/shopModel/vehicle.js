var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-regex-search'));

var vehicleSchema = mongoose.Schema({
    make: {
        type: String,
        required: true,
        searchable: true
    },
    model: {
        type: String,
        searchable: true
    },
    year: {
        type: String,
        searchable: true
    },
    mileage: {
        type: Number,
        searchable: true
    },
    VIN: {
        type: String,
        searchable: true
    },
    license: {
        type: String,
        searchable: true
    },
    engine: {
        type: String,
        searchable: true
    },
    lastInDate: {
        type: Date, //DATE OF ORDER CREATION
        searchable: true
    },
    inspDate: {
        type: Date,
        searchable: true
    }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
