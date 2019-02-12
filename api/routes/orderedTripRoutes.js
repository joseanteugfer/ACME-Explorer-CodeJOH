'use strict'

const express = require('express');
const router = express.Router();
var orderedTrip = require('../controllers/OrderedTripController')

router.get('/orderedTrips', orderedTrip.list_all_orderedTrip);
router.post('/orderedTrips', orderedTrip.create_an_orderedTrip);

router.get('/orderedTrips/:orderedTripId', orderedTrip.read_an_orderedTrip);
router.delete('/orderedTrips/:orderedTripId', orderedTrip.delete_an_orderedTrip);
router.put('/orderedTrips/:orderedTripId', orderedTrip.update_an_orderedTrip);

/**
   * Change trip order status:
   *    RequiredRoles: Manager
   *
   * @section orderedTrip
   * @type put 
   * @url /v1/orderedTrip
   * @param {string} status //
  */
 router.put('/orderedTrips/:orderedTripId', orderedTrip.change_status)

 /**
   * Get ordered trips groupBy status
   *    RequiredRoles: Explorer
   * 
   * @section orderedTrips
	 * @type get
	 * @url /v1/orderedTrips/search
   * @param {string} groupBy (status)
   */
  router.get('/orderedTrips/:actorId/search', orderedTrip.search_by_status)

    /**
   * Pay the trip
   *    RequiredRoles: Explorer
   * 
   * @section orderedTrips
   * @type put
   */
  router.put('/orderedTrips/:orderTripId/pay', orderedTrip.pay)



module.exports = router;