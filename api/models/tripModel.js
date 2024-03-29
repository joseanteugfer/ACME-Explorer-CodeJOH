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

const SponsorshipSchema = new Schema({
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
    },
    payed: {
        type: Boolean,
        default: false
    }
});

const TripSchema = new Schema({
    ticker: {
        type: String,
        unique: true
    },
    manager: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
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
        type: String
    }],
    date_start: {
        type: Date,
        required: true,
        validate: [
            startDateValidator,
            'Start date must be greater than Today date'
        ]
    },
    date_end: {
        type: Date,
        required: true,
        validate: [
            endDateValidator,
            'End date must be greater than Start date']
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
    comments: {
        type: String
    },
    stages: [StageSchema],
    sponsorships: [SponsorshipSchema]
}, { strict: false });

TripSchema.index({ price: 1 });
TripSchema.index({ date_start: 1, date_end: 1 });
TripSchema.index({ ticker: 'text', title: 'text', description: 'text' }, { weights: { ticker: 10, title: 5, description: 1 } });


const FinderCacheSchema = new Schema({
    trips: [TripSchema],
    actor: {
        type: Schema.Types.ObjectId,
        ref: 'Actor',
        required: true
    },
    expiresDate: {
        type: Date
    }
})
FinderCacheSchema.index({ actor: 1 });


TripSchema.pre('save', function (next) {
    let trip = this;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let randomletters = generate(alphabet, 4);
    let now = moment().format("YYMMDD");
    trip.ticker = `${now}-${randomletters}`;

    this.constructor.findOne({ ticker: trip.ticker }, function (err, newTrip) {
        if (newTrip) {
            while (newTrip.ticker == trip.ticker) {
                randomletters = generate(alphabet, 4);
            }
            trip.ticker = `${now}-${randomletters}`;
        }
    });

    //calculating the total price as sum of the stages prices
    calculatePrice(trip);
    next();
});
TripSchema.pre('findOneAndUpdate', function (next) {
    if (this.getUpdate().stages) {
        calculatePrice(this.getUpdate());
    }
    next();
});

function calculatePrice(trip) {
    trip.price = trip.stages.map((stage) => {
        return stage.price
    }).reduce((sum, price) => {
        return sum + price;
    });
}

function endDateValidator(endDate) {
    var startDate = this.date_start;
    if (!startDate) //making an update
        startDate = new Date(this.getUpdate().date_start);
    return startDate <= endDate;
}

function startDateValidator(startDate) {
    let now = moment();
    //return now <= startDate;
    return true;
}

module.exports = {
    'Trip': mongoose.model('Trip', TripSchema),
    'FinderCache': mongoose.model('FinderCache', FinderCacheSchema)
};