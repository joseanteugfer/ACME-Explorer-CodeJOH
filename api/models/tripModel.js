'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const moment = require('moment');
const generate = require('nanoid/generate');

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
    actorId: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    }
});

const TripSchema = new Schema({
    ticker: {
        type: String
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
        requiered: true
    },
    date_end: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['CREATED', 'PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED'],
        default: 'CREATED'
    },
    stages: [StageSchema],
    sponsors: [SponsorSchema]
}, {strict: false});

TripSchema.pre('save', function(next){
    let trip = this;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let randomletters = generate(alphabet,4);
    let now = moment().format("YYMMDD");
    trip.ticker = `${now}-${randomletters}`;
    next();
});

module.exports = mongoose.model('Trip', TripSchema);