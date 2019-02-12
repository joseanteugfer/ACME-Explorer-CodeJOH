'use strict'

const actorRouter = require('./actorRoutes');
const tripRouter = require('./tripRoutes');

module.exports = [
    actorRouter,
    tripRouter
]