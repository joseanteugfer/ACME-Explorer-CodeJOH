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
 * 
 * @swagger
 * 
 * definitions:
 *   ErrorValidationResponse:
 *    required:
 *       - message
 *       - name
 *    properties:
 *       message:
 *          type: string
 *       name:
 *          type: string
 *       _message:
 *         type: string
 *       errors:
 *         type: string
 *   ErrorResponse:
 *     required:
 *       - message
 *     properties:
 *       message:
 *         type: string
 *   OrderedTrip:
 *       type: object
 *       properties:
 *          ticker:
 *             type: string
 *             description: Identificador( ticker) del viaje
 *          status:
 *             type: string
 *             description: Estado de la reserva
 *             enum: ['PENDING', 'REJECTED','DUE','ACCEPTED','CANCELLED']
 *          date_apply:
 *             type: styring
 *             format: date
 *             description: Fecha de creacion de la reserva
 *          comments:
 *             type: string
 *             description: Comentarios sobre la reserva
 *          actor_id:
 *             type: string
 *             description: ID del explorer que hizo la reserva
 *   OrderedTripsResponse:
 *        type: array
 *        items: 
 *        $ref: "#/definitions/OrderedTrip"
 *   OrderedTripCreated:
 *       type: object
 *       properties:
 *          _id:
 *             type: number
 *             description: ID
 *          _v:
 *              type: number
 *         ticker:
 *             type: string
 *             description: Identificador( ticker) del viaje
 *          status:
 *             type: string
 *             description: Estado de la reserva
 *             enum: ['PENDING', 'REJECTED','DUE','ACCEPTED','CANCELLED']
 *          date_apply:
 *             type: styring
 *             format: date
 *             description: Fecha de creacion de la reserva
 *          comments:
 *             type: string
 *             description: Comentarios sobre la reserva
 *          actor_id:
 *             type: string
 *             description: ID del explorer que hizo la reserva
 * 
 */

/**
 * @swagger
 * 
 * /orderedTrips/search:
 *    get:
 *       description: Search orderedTrip.RequiredRoles-any
 *       operationId: search_orderedTrip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: query
 *            name: keyword
 *            description: Keyword to find in ticker, title or description
 *            schema:
 *                type: string
 *          - in: query
 *            name: actor
 *            description: Find trips for this Manager
 *            schema:
 *                type: string
 *                format: uuid
 *          - in: query
 *            name: startFrom
 *            description: Return results from this point
 *            schema:
 *                type: number
 *          - in: query
 *            name: pageSize
 *            description: Return this amount of results
 *            schema:
 *                type: number
 *          - in: query
 *            name: sortedBy
 *            description: Sort by this date_start, price, title, description, status
 *            schema:
 *                type: string
 *          - in: query
 *            name: reverse
 *            description: (true|false)
 *            schema:
 *                type: string
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/OrderedTripsResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/search')
      .get(orderedTrip.search_orderedTrip);

router.route('/v1/orderedTrips').get(orderedTrip.list_all_orderedTrip);

router.route('/v1/orderedTrips').post(orderedTrip.create_an_orderedTrip);

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