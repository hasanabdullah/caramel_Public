var mongoose = require("mongoose");
mongoose.plugin(require('mongoose-regex-search'));

var issueSchema = new mongoose.Schema({
    complaint: {
        type: String,
        searchable: true
    },
    cause: {
        type: String,
        searchable: true
    },
    correction: {
        type: String,
        searchable: true
    }
});

module.exports = mongoose.model("Issue", issueSchema);