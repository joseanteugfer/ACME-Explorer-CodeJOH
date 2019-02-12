'use strict'

const actorRouter = require('./actorRoutes');
const tripRouter = require('./tripRoutes');
const orderedTripRouter = require('./orderedTripRoutes');

module.exports = [
    actorRouter,
    tripRouter,
    orderedTripRouter
]