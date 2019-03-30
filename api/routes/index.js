'use strict'

const actorRouter = require('./actorRoutes');
const tripRouter = require('./tripRoutes');
const orderedTripRouter = require('./orderedTripRoutes');
const dashboardRouter = require('./dashboardRoutes');
const storeRouter = require('./storeRoutes');
const configRouter = require('./configRoutes')

module.exports = [
    actorRouter,
    tripRouter,
    orderedTripRouter,
    dashboardRouter,
    storeRouter,
    configRouter
]