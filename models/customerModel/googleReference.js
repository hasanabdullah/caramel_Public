var mongoose = require('mongoose');

var googleReferenceSchema = mongoose.Schema({
    gid: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        dropDups: true
    },
    name: {
        type: String,
        trim: true
    },
    vicinity: {
        type: String,
        trim: true
    },
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop'
    }
});

module.exports = mongoose.model('GoogleReference', googleReferenceSchema);