'use strict'

const moment = require('moment');
const express = require('express');
const router = express.Router();
const orderedTrip = require('../controllers/OrderedTripController')
const middleware = require('../middlewares/middleware')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  let now = moment().format("YYYY/MM/DD-hh:mm:ss");
  console.log('Time: ', now);
  next();
});

/**
   * get results from a search engine
   *    RequiredRoles: None
   * 
   * @section orderedTrips
	 * @type get
	 * @url /v1/orderedTrips/search
   * @param {string} ticker 
   * @param {string} actor (actorId)
   * @param {string} startFrom
   * @param {string} pageSize
   * @param {string} sortedBy (actor)
   * @param {string} reverse (true|false) 
   * @param {string} keyword //in ticker, status, or comments
   */
router.route('/v1/orderedTrips/search')
      .get(orderedTrip.search_orderedTrip);

router.route('/v1/orderedTrips')
      .get(orderedTrip.list_all_orderedTrip)
      .post(orderedTrip.create_an_orderedTrip);

router.route('/v1/orderedTrips/:orderedTripId')
      .get(orderedTrip.read_an_orderedTrip)
      .delete(orderedTrip.delete_an_orderedTrip)
      .put(orderedTrip.update_an_orderedTrip);

/**
   * Change trip order status:
   *    RequiredRoles: Manager, Explorer
   *
   * @section orderedTrip
   * @type put 
   * @url /v1/orderedTrip
   * @param {string} status //
  */
 router.route('/v1/orderedTrips/:orderedTripId/status')
       .put(orderedTrip.change_status);

 /**
   * Get ordered trips groupBy status
   *    RequiredRoles: Explorer
   * 
   * @section orderedTrips
	 * @type get
	 * @url /v1/orderedTrips/search
   * @param {string} groupBy (status)
   */
  router.route('/v1/orderedTrips/:actorId/search')
        .get(orderedTrip.search_by_status);

    /**
   * Pay the trip
   *    RequiredRoles: Explorer
   * 
   * @section orderedTrips
   * @type put
   */
  router.route('/v1/orderedTrips/:orderedTripId/pay')
        .put(middleware.checkExplorer,orderedTrip.pay);



module.exports = router;