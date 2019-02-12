const express = require('express');
const router = express.Router();
var trips = require('../controllers/tripController')

/**
   * Manage all trips:
   *    RequiredRoles: any
   *
   * @section trips
   * @type get 
   * @url /v1/trips
  */
router.get('/trips', trips.list_all_trips);

/**
   * Create trip:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type post 
   * @url /v1/trips
  */
router.post('/trips', trips.create_a_trip);

/**
   * Get trip by id:
   *    RequiredRoles: any
   *
   * @section trips
   * @type get 
   * @url /v1/trips
  */

router.get('/trips/:tripId', trips.read_a_trip);

/**
   * Delete trip:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type post 
   * @url /v1/trips
  */

router.delete('/trips/:tripId', trips.delete_a_trip);

/**
   * Update trip:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type post 
   * @url /v1/trips
  */

router.put('/trips/:tripId', trips.update_a_trip);

/**
   * Search trip:
   *    RequiredRoles: any
   *
   * @section trips
   * @type post 
   * @url /v1/trips
   * @param {string} keyword //in sku, name, or description
   * @param {string} priceRangeMin
   * @param {string} priceRangeMax
   * @param {string} dateRangeStart,
   * @param {string} dateRangeEnd
  */
router.get('/trips/search', trips.search_trips_keyword)
/**
   * Change trip status:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type put 
   * @url /v1/trips
   * @param {string} status //
  */
 router.put('/trips/:tripId', trips.change_status)

router.get('/trips/:actorId/sponsorships',trips.get_sponsorhips)
router.put('/trips/:tripId/:actorId', trips.update_sponsorhips)
router.delete('/trips/:tripId/:actorId', trips.delete_sponsorhip)
module.exports = router;
