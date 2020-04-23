var mongoose = require('mongoose');
mongoose.plugin(require('mongoose-regex-search'));

var representativeSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    desc: {
        type: String
    }
});

module.exports = mongoose.model('Representative', representativeSchema);