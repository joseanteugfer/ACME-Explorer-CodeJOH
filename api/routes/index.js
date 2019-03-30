'use strict'

const actorRouter = require('./actorRoutes');
const tripRouter = require('./tripRoutes');
const orderedTripRouter = require('./orderedTripRoutes');
const dashboardRouter = require('./dashboardRoutes');
const configRouter = require('./configRoutes')

module.exports = [
    actorRouter,
    tripRouter,
    orderedTripRouter,
    dashboardRouter, 
    configRouter
]