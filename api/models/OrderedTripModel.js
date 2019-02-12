'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderedTripSchema = new Schema({
    ticker: {
        type: String,
        required: 'Enter ticker'
    },
    status: {
        type: String,
        enum: ['PENDING', 'REJECTED','DUE','ACCEPTED','CANCELLED']
    },
    date_apply: {
        type: Date, 
        default: Date.now()
    },
    comments: {
        type: String
    },
    actor_id: {
        type: Schema.Types.ObjectId,
        ref: 'Actor'
    }
}, {strict: false})

module.exports = mongoose.model('OrderedTrip',OrderedTripSchema);