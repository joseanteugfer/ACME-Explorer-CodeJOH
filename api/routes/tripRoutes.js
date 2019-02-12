const express = require('express');
const router = express.Router();
var trips = require('../controllers/tripController')

router.get('/trips', trips.list_all_trips);
router.post('/trips', trips.create_a_trip);

router.get('/trips/:tripId', trips.read_a_trip);
router.delete('/trips/:tripId', trips.delete_a_trip);
router.put('/trips/:tripId', trips.update_a_trip);

module.exports = router;
