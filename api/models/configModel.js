'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ConfigSchema = new Schema({
    numberResults: {
        type: Number,
        max: 100,
        min: 1,
        default: 10,
    },
    searchPeriod: {
        type: Number,
        min: 1,
        max: 24,
        default: 1
    }
});

module.exports = mongoose.model('Config', ConfigSchema);