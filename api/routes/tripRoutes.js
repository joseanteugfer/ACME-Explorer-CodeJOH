const express = require('express');
const router = express.Router();
var trips = require('../controllers/tripController')

/**
   * Get all trips:
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
   * Search trip using only keyword:
   *    RequiredRoles: any
   * Search trip using a finder(keyword, priceRangeMin, priceRangeMax, dataRangeStart, dateRangeEnd):
   *    RequiredRoles: Explorer
   *
   * @section trips
   * @type get 
   * @url /v1/trips/search
   * @param {string} keyword //in tickers, titles description
   * @param {string} priceRangeMin
   * @param {string} priceRangeMax
   * @param {string} dateRangeStart
   * @param {string} dateRangeEnd
  */

router.get('/trips/search', trips.search_trips)

/**
* Get all sponsorships
*  RequiredRoles: Sponsor
* 
* @section trips
* @type get
* @url /v1/trips/sponsorships
*/
router.get('/trips/sponsorships', trips.get_sponsorhips)


/**
   * Get trip by id:
   *    RequiredRoles: any
   *
   * @section trips
   * @type get 
   * @url /v1/trips/:tripId
  */

router.get('/trips/:tripId', trips.read_a_trip);

/**
   * Delete trip if it's not published:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type delete 
   * @url /v1/trips/:tripId
  */

router.delete('/trips/:tripId', trips.delete_a_trip);

/**
   * Update trip if it's not published:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type put 
   * @url /v1/trips/:tripId
  */

router.put('/trips/:tripId', trips.update_a_trip);


/**
   * Change trip status:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type put 
   * @url /v1/trips
   * @param {string} val // one of this values ['PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED']
  */
router.put('/trips/:tripId/status', trips.change_status)


/**
 * Create a new sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type post
 * @url /v1/trips/:tripId/sponsorships
 */
router.post('/trips/:tripId/sponsorships', trips.add_sponsorhips)

/**
 * Update a new sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type put
 * @url /v1/trips/:tripId/sponsorships/:sponsorshipId
 */
router.put('/trips/:tripId/sponsorships/:sponsorshipId', trips.update_sponsorhips)

/**
 * Delete a sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type delete
 * @url /v1/trips/:tripId/sponsorships/:sponsorshipId
 */
router.delete('/trips/:tripId/sponsorships/:sponsorshipId', trips.delete_sponsorhips)

/**
 * Pay a sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type put
 * @url /v1/trips/:tripId/sponsorships/pay
 */
router.put('/trips/:tripId/sponsorships/pay', trips.pay_sponsorhips)


module.exports = router;
