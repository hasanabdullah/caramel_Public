var mongoose = require("mongoose");
var {getNumber, setNumber} = require('../../functionality/number');
mongoose.plugin(require('mongoose-regex-search'));

var serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        searchable: true
    },
    category: {
        type: String,
        searchable: true
    },
    unitCost: {
        type: Number,
        required: true,
        get: getNumber,
        set: setNumber,
        searchable: true
    },
    quantity: {
        type: Number,
        required: true,
        get: getNumber,
        set: setNumber,
        searchable: true
    },
    issueNumber: {
        type: Number,
        searchable: true
    },
    technician: {
        type: String,
        searchable: true
    },
    source: {  //required as a sub field when choosing parts
        type: String,
        searchable: true
    }
});

module.exports = mongoose.model("Service", serviceSchema);
