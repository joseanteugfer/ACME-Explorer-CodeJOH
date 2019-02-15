'use strict'

const actorRouter = require('./actorRoutes');
const tripRouter = require('./tripRoutes');
const orderedTripRouter = require('./orderedTripRoutes');
const dashboardRouter = require('./dashboardRoutes');

module.exports = [
    actorRouter,
    tripRouter,
    orderedTripRouter,
    dashboardRouter
]