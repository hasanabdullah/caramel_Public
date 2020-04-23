var mongoose = require("mongoose");
var {getNumber, setNumber} = require('../../functionality/number');

var jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    unitCost: {
        type: Number,
        required: true,
        get: getNumber,
        set: setNumber
    }
});

module.exports = mongoose.model("Job", jobSchema);
