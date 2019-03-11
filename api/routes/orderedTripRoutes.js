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
 *            description: Keyword to find in orderedTrip ticker, status or description
 *            schema:
 *                type: string
 *          - in: query
 *            name: actor
 *            description: Find orderedTrips for this Explorer
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
 *            description: Sort by this ticker, status, actor_id or date_apply
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

/**
 * 
 * @swagger
 * 
 * /orderedTrips:
 *     get:
 *       description: Returns all orderedTrips
 *       operationId: list_all_orderedTrip
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
router.route('/v1/orderedTrips').get(orderedTrip.list_all_orderedTrip);

/**
 * @swagger
 * 
 * /orderedTrips:
 *    post:
 *       description: Create new orderedTrip
 *       operationId: create_an_orderedTrip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: trip
 *            description: Viaje a crear
 *            schema:
 *                $ref: "#/definitions/OrderedTrip"
 *       responses:
 *          '201':
 *             description: Created
 *             schema:
 *             $ref: '#/definitions/OrderedTripCreated'
 *          '422':
 *             description: Error de validacion
 *             schema:
 *             $ref: "#/definitions/ErrorValidationResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips').post(orderedTrip.create_an_orderedTrip);

/**
 * @swagger
 * 
 * /orderedTrips/{orderedTripId}:
 *    get:
 *       description: Get a orderedTrip 
 *       operationId: read_an_orderedTrip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: orderedTripId
 *            description: Find orderedTrip with this id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/OrderedTrip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/:orderedTripId').get(orderedTrip.read_an_orderedTrip);

/**
 * @swagger
 * 
 * /orderedTrips/{orderedTripId}:
 *    delete:
 *       description: Delete a orderedTrip 
 *       operationId: delete_an_orderedTrip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: orderedTripId
 *            description: Delete orderedTrip with this id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                type: object
 *                properties:
 *                   message:
 *                      type: string
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/:orderedTripId').delete(orderedTrip.delete_an_orderedTrip);

/**
 * @swagger
 * 
 * /orderedTrips/{orderedTripId}:
 *    put:
 *       description: Update a orderedTrip 
 *       operationId: update_an_orderedTrip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: orderedTripId
 *            description: Update orderedTrip with this id
 *            type: string
 *          - in: body
 *            name: trip
 *            description: orderedTrip to update
 *            schema:
 *                $ref: "#/definitions/OrderedTrip"
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/OrderedTrip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/:orderedTripId').put(orderedTrip.update_an_orderedTrip);

/**
 * @swagger
 * 
 * /orderedTrips/{orderedTripId}/status:
 *    put:
 *       description: Change orderedTrip status
 *       operationId: change_status
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: orderedTripId
 *            description: Update orderedTrip with this id
 *            type: string
 *          - in: query
 *            name: status
 *            description: status of orderedTrip to change
 *            schema:
 *                type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/OrderedTrip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/:orderedTripId/status').put(orderedTrip.change_status);

/**
 * @swagger
 * 
 * /orderedTrips/{actorId}/search:
 *    get:
 *       description: Get ordered trips groupBy status
 *       operationId: search_by_status
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: actorId
 *            description: Find orderedTrip of actorId
 *            type: string
 *          - in: query
 *            name: groupBy
 *            description: group result by status
 *            schema:
 *                type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/OrderedTrip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/:actorId/search').get(orderedTrip.search_by_status);

/**
 * @swagger
 * 
 * /orderedTrips/{orderedTripId}/pay:
 *    put:
 *       description: Update a orderedTrip 
 *       operationId: pay
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: orderedTripId
 *            description: Pay orderedTrip with this id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/OrderedTrip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/orderedTrips/:orderedTripId/pay').put(orderedTrip.pay);

router.route('/v2/orderedTrips/:orderedTripId/pay').put(authController.verifyUser(["EXPLORER"]),orderedTrip.pay);



module.exports = router;