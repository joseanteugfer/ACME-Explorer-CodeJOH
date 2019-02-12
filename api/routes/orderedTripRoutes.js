'use strict'

const express = require('express');
const router = express.Router();
var orderedTrip = require('../controllers/OrderedTripController')

router.get('/orderedTrip', orderedTrip.list_all_orderedTrip);
router.post('/orderedTrip', orderedTrip.create_an_orderedTrip);

router.get('/orderedTrip/:orderedTripId', orderedTrip.read_an_orderedTrip);
router.delete('/orderedTrip/:orderedTripId', orderedTrip.delete_an_orderedTrip);
router.put('/orderedTrip/:orderedTripId', orderedTrip.update_an_orderedTrip);

module.exports = router;