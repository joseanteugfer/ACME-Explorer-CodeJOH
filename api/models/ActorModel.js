'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ActorSchema = new Schema({
    name: {
        type: String,
        required: 'Enter de actor name'
    },
    surname: {
        type: String,
        required: 'Enter de actor surname'
    },
    email: {
        type: String,
        required: 'Enter email actor'
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
        type: String,
        required: 'Enter the telephone'
    },
    address: {
        type: String,
        required: 'Enter the address'
    },
    photo: {
        data: Buffer,
        contentType: 'String' // MimeType
    },
    role: [
        {
            type: String,
            required: 'Enter de roles',
            enum: ['MANAGER', 'EXPLORER', 'ADMINISTRATOR', 'SPONSOR']
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
}, {strict: false});

module.exports = mongoose.model('Actor', ActorSchema);