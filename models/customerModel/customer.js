// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var customerSchema = mongoose.Schema({
    name: {
        type: String,
        default: "new user"
    },
    email: {
        type: String,
        required: true,
        dropDups: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: "Enter the phone"
    },
    address: {
        type: String,
        default: "Enter the address"
    },
    zip: {
        type: String,
        default: "Enter the zip"
    },
    city: {
        type: String,
        default: "Enter the city"
    },
    state: {
        type: String,
        default: "Enter the state"
    },
    vehicles: [{
        type: mongoose.Schema.ObjectId,
        ref: "Vehicle"
    }],
    friends: [{
        type: mongoose.Schema.ObjectId,
        ref: "Customer"
    }],
    file:[{
        type:mongoose.Schema.ObjectId,
        ref:"File"
    }],
    /*pdfDesc: [{
        type: String,
        default: "",
        searchable: true
    }],
    jpgDesc: [{
        type: String,
        default: "",
        searchable: true
    }],*/
    fav: [{
        type: mongoose.Schema.ObjectId,
        ref: 'GoogleReference'
    }],
    activated: {
        type: Boolean,
        default: false
    },
    activateToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    fbId: {
        type: String
    },
    fakeKey: {
        type: Number,
        default: 1
    }
});

// generating a hash
customerSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
customerSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Customer', customerSchema);
