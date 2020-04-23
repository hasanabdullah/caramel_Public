// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var shopSchema = mongoose.Schema({
    name: {
        type: String,
        default: "new user"
    },
    bayNumber: Number,
    technician: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Technician'
    }],
    address: String,
    phone: String,
    zip: String,
    state: String,
    city: String,
    email: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    customer: [{
        type: mongoose.Schema.ObjectId,
        ref: 'ShopCustomer'
    }],
    job: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Job'
    }],
    activated: {
        type: Boolean,
        default: false
    },
    activateToken: String,
    lastMonth: {
        type: Number,
        default: 1
    },
    lastYear: {
        type: Number,
        default: 2018
    },
    lastNumber: {
        type: Number,
        default: 0
    }
});

// generating a hash
shopSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
shopSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Shop', shopSchema);
