'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const StageSchema = new Schema({
    title: {
        type: String,
        required: 'Enter the stage title'
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        min: 0,
        required: 'Enter the stage price'
    }
});

const SponsorSchema = new Schema( {
    link: {
        type: String,
        required: 'Enter the sponsor page link'
    },
    banner: {
        data: Buffer, 
        contentType: String
    },
    name: {
        type: String, 
        required: 'Enter the sponsor name'
    },
    surname: {
        type: String, 
        required: 'Enter the sponsor surname'
    },
    email: {
        type: String, 
        required: 'Enter the sponsor email'
    }
});

const TripSchema = new Schema({
    ticker: {
        type: String,
        required: 'Enter ticker'
    },
    title: {
        type: String,
        required: 'Enter trip title'
    },
    description: {
        type: String,
        required: 'Enter trip description'
    },
    price: {
        type: Number,
        min: 0
    },
    requirements: [String],
    pictures: [{
        data: Buffer, 
        contentType: String
      }],
    date_start: {
        type: Date,
        default: Date.now
    },
    date_end: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    stages: [StageSchema],
    sponsors: [SponsorSchema]
}, {strict: false});

module.exports = mongoose.model('Trip', TripSchema);