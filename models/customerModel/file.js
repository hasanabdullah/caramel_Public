var mongoose = require('mongoose');

var fileSchema = mongoose.Schema({
    name:{
        type:String
    },
    fileType:{
        type:String
    },
    desc:{
        type:String
    },
    source:{
        type:String
    }
});

module.exports = mongoose.model('File', fileSchema);