var mongoose = require("mongoose");

var technicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Technician", technicianSchema);
