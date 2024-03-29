'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OrderedTripSchema = new Schema({
    ticker: {
        type: String,
        required: 'Enter ticker',
        validate: {
            validator: function(v) {
                const keyRegExp = /^[0-9]{6}\-[A-Z]{4}$/;
                return keyRegExp.test(v);
            },
        }
    },
    status: {
        type: String,
        enum: ['PENDING', 'REJECTED','DUE','ACCEPTED','CANCELLED'],
        default: 'PENDING'
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
        ref: 'Actor',
        required: 'Enter actor_id'
    }
}, {strict: false})

OrderedTripSchema.index({ ticker: 1, status: 1 }); //1 ascending,  -1 descending
OrderedTripSchema.index({ ticker: 'text', status: 'text', comments: 'text' });

module.exports = mongoose.model('OrderedTrip',OrderedTripSchema);