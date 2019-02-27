const express = require('express');
const router = express.Router();
var trips = require('../controllers/tripController')
const middleware = require('../middlewares/middleware')

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
   * @url /v1/trips/:actorId
  */
router.post('/trips/:actorId', middleware.checkManager, trips.create_a_trip);

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
* @url /v1/trips/sponsorships/:actorId
*/
router.get('/trips/sponsorships/:actorId', trips.get_sponsorhips)


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

router.delete('/trips/:actorId/:tripId', middleware.checkManager,trips.delete_a_trip);

/**
   * Update trip if it's not published:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type put 
   * @url /v1/trips/:tripId
  */

router.put('/trips/:actorId/:tripId', middleware.checkManager, trips.update_a_trip);


/**
   * Change trip status:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type put 
   * @url /v1/trips
   * @param {string} val // one of this values ['PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED']
  */
router.put('/trips/:actorId/:tripId/status', middleware.checkManager, trips.change_status)


/**
 * Create a new sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type post
 * @url /v1/trips/:tripId/:actorId/sponsorships
 */
router.post('/trips/:tripId/:actorId/sponsorships', trips.add_sponsorhips)

/**
 * Update a sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type put
 * @url /v1/trips/:tripId/sponsorships/:sponsorshipId
 */
router.put('/trips/:tripId/sponsorships/:sponsorshipId', trips.update_sponsorhips)

/**
 * Get a sponsorship
 *  RequiredRoles: Sponsor
 * 
 * @section trips
 * @type get
 * @url /v1/trips/:tripId/sponsorships/:sponsorshipId
 */
router.get('/trips/:tripId/sponsorships/:sponsorshipId', trips.get_a_sponsorhip)

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
 * @url /v1/trips/:tripId/sponsorships/:sponsorshipId/pay
 */
router.put('/trips/:tripId/sponsorships/:sponsorshipId/pay', trips.pay_sponsorhips)


module.exports = router;
