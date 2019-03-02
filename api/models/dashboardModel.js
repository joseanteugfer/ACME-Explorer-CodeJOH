'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TripsPerManagerSchema = new Schema({
    minTripsManager: {
        type: Number,
        min: 0
    },
    maxTripsManager: {
        type: Number,
        miin: 0
    },
    avgTripsManager: {
        type: Number,
        min: 0
    },
    stdDevTripsManager: {
        type: Number,
        min: 0
    }
});

const OrderedtripsPerTrips = new Schema({
    minOrderedTrips: {
        type: Number,
        min: 0
    },
    maxOrderedTrips: {
        type: Number,
        min: 0
    },
    avgOrderedTrips: {
        type: Number,
        min: 0
    },
    stdDevOrderedTrips: {
        type: Number,
        min: 0
    }
});

const PricePerTrips = new Schema({
    minPrice: {
        type: Number,
        mn: 0
    },
    maxPrice: {
        type: Number,
        min: 0
    },
    avgPrice: {
        type: Number,
        min: 0
    },
    stdDevPrice: {
        type: Number,
        min: 0
    }
});

const DashboardSchema = new Schema({

    tripsPerManager: TripsPerManagerSchema,
    orderedtripsPerTrips: OrderedtripsPerTrips,
    pricePerTrips: PricePerTrips,
    ratioOrderedtrips: {
        type: Number,
        max: 1,
        min: 0
    },
    avgPriceRangeFinders: {
        type: Number,
        min: 0
    },
    topKeywordsFinders: [{
        keyword: String,
        keywordSum: Number
    }],
    computationMoment: {
        type: Date,
        default: Date.now
    },
    rebuildPeriod: {
        type: String
    }
}, { strict: false });

DashboardSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('Dashboard', DashboardSchema);