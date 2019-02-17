'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var moment = require('moment');

const FinderSchema = new Schema({
    keyword: {
        type: String
    },
    priceRangeMin: {
        type: Number,
        min: 0
    },
    priceRangeMax: {
        type: Number,
        validate: [
            priceRangeValidator,
            'Max range price must be bigger than min range price']
    },
    dateRangeStart: {
        type: Date,
        validate: [
            startDateValidator,
            'Start date must be after Today date']
    },
    dateRangeEnd: {
        type: Date,
        validate: [
            endDateValidator,
            'End date must be after Start date']
    }
})

const ActorSchema = new Schema({
    name: {
        type: String,
        required: 'Enter the actor name'
    },
    surname: {
        type: String,
        required: 'Enter the actor surname'
    },
    email: {
        type: String,
        required: 'Enter email actor',
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: 'Enter password'
    },
    preferredLanguage: {
        type: String,
        default: 'es'
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    paypal: {
        type: String
    },
    role: [
        {
            type: String,
            required: 'Enter the role',
            enum: ['MANAGER', 'EXPLORER', 'ADMINISTRATOR', 'SPONSOR']
        }
    ],
    validated: {
        type: Boolean
    },
    banned: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    finder: FinderSchema
}, { strict: false });



ActorSchema.pre('save', function (callback) {
    var actor = this;
    // Break out if the password hasn't changed
    if (!actor.isModified('password')) return callback();

    // Password changed so we need to hash it
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);

        bcrypt.hash(actor.password, salt, function (err, hash) {
            if (err) return callback(err);
            actor.password = hash;
            callback();
        });
    });
});

ActorSchema.methods.verifyPassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        console.log('verifying password in actorModel: ' + password);
        if (err) return cb(err);
        console.log('iMatch: ' + isMatch);
        cb(null, isMatch);
    });
};

function priceRangeValidator(maxPrice){
    var minPrice = this.priceRangeMin;
    return maxPrice > minPrice;
}

function endDateValidator(endDate){
    var startDate = this.dateRangeStart;
    if(!startDate) //making an update
        startDate = new Date(this.getUpdate().dateRangeStart);
    return startDate <= endDate;
}

function startDateValidator(startDate){
    let now = moment();
    return now <= startDate;
}

module.exports = mongoose.model('Actor', ActorSchema);