const express = require('express');
const router = express.Router();
const trips = require('../controllers/tripController');
const auth = require('../controllers/authController');

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
 *   Sponsorship:
 *       type: object
 *       properties:
 *          link:
 *             type: string
 *             description: Link
 *          banner:
 *             type: string
 *             description: Banner
 *          actorId:
 *             type: string
 *             description: Sponsor Id
 *          payed:
 *             type: boolean
 *             description: Indicates if the sponsor already payed the sponsorship
 *   Trip:
 *       type: object
 *       properties:
 *          ticker:
 *             type: string
 *             description: Identificador( ticker) del viaje
 *          title:
 *             type: string
 *             description: Título del viaje
 *          description:
 *             type: string
 *             description: Descripción del viaje
 *          manager:
 *             type: string
 *             description: ID del actor que creo el viaje
 *          price:
 *             type: number
 *             description: Precio del viaje
 *             minimum: 0
 *          requirements:
 *             type: array
 *             description: Requerimientos del viaje
 *             items:
 *                type: string
 *          pictures: 
 *             type: array
 *             description: Fotos del viaje
 *             items: 
 *                type: string
 *          date_start:
 *             type: string
 *             format: date
 *             description: Fecha inicio del viaje
 *          date_end:
 *             type: string
 *             format: date
 *             description: Fecha final del viaje
 *          created:
 *             type: string
 *             format: date
 *             description: Fecha creación del viaje
 *          status:
 *             type: string
 *             description: Estado del viaje
 *             enum: ['CREATED', 'PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED']
 *          comments:
 *             type: string
 *             description: Comentario sobre el motivo de la cancelación de un viaje
 *          stages:
 *             type: array
 *             required:
 *                - title
 *                - price
 *             description: Etapas del viaje
 *             items:
 *                type: object
 *                properties:
 *                   title:
 *                      type: string
 *                      description: Título de la Etapa
 *                   description:
 *                      type: string
 *                      description: Descripción de la Etapa
 *                   price:
 *                      type: number
 *                      description: Precio de la etapa
 *                      minimum: 0
 *          sponsors:
 *             type: array
 *             required:
 *                - link
 *                - actorId
 *             description: Patrocinadores del viaje (los patrocinadores son actores)
 *             items:
 *                type: object
 *                properties:
 *                   link:
 *                      type: string
 *                      description: Enlace a la página del patrocinador
 *                   banner:
 *                      type: string
 *                      description: Banner del patrocinador
 *                   actorId:
 *                      type: string
 *                      description: ID del patrocinador
 *                   payed:
 *                      type: boolean
 *                      description: Indica si el patrocinador ya pagó
 *   TripsResponse:
 *        type: array
 *        items: 
 *          $ref: "#/definitions/Trip"
 *   TripCreated:
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
 *          title:
 *             type: string
 *             description: Título del viaje
 *          description:
 *             type: string
 *             description: Descripción del viaje
 *          manager:
 *             type: string
 *             description: ID del actor que creo el viaje
 *          price:
 *             type: number
 *             description: Precio del viaje
 *             minimum: 0
 *          requirements:
 *             type: array
 *             description: Requerimientos del viaje
 *          items:
 *             type: string
 *          pictures: 
 *             type: array
 *             description: Fotos del viaje
 *             items: 
 *                type: string
 *          date_start:
 *             type: string
 *             format: date
 *             description: Fecha inicio del viaje
 *          date_end:
 *             type: string
 *             format: date
 *             description: Fecha final del viaje
 *          created:
 *             type: string
 *             format: date
 *             description: Fecha creación del viaje
 *          status:
 *             type: string
 *             description: Estado del viaje
 *             enum: ['CREATED', 'PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED']
 *          comments:
 *             type: string
 *             description: Comentario sobre el motivo de la cancelación de un viaje
 *          stages:
 *             type: array
 *             required:
 *                - title
 *                - price
 *             description: Etapas del viaje
 *             items:
 *                type: object
 *                properties:
 *                   title:
 *                      type: string
 *                      description: Título de la Etapa
 *                   description:
 *                      type: string
 *                      description: Descripción de la Etapa
 *                   price:
 *                      type: number
 *                      description: Precio de la etapa
 *                      minimum: 0
 *          sponsors:
 *             type: array
 *             required:
 *                - link
 *                - actorId
 *             description: Patrocinadores del viaje (los patrocinadores son actores)
 *             items:
 *                type: object
 *                properties:
 *                   link:
 *                      type: string
 *                      description: Enlace a la página del patrocinador
 *                   banner:
 *                      type: string
 *                      description: Banner del patrocinador
 *                   actorId:
 *                      type: string
 *                      description: ID del patrocinador
 *                   payed:
 *                      type: boolean
 *                      description: Indica si el patrocinador ya pagó
 * 
 */

/**
 * 
 * @swagger
 * 
 * /trips:
 *     get:
 *       description: Returns all trips
 *       operationId: list_all_trips
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/TripsResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"

*/
router.get('/v1/trips', trips.list_all_trips);

/**
 * @swagger
 * 
 * /trips:
 *    post:
 *       description: Crea un nuevo viaje
 *       operationId: create_a_trip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: trip
 *            description: Viaje a crear
 *            schema:
 *                $ref: "#/definitions/Trip"
 *       responses:
 *          '201':
 *             description: Created
 *             schema:
 *             $ref: '#/definitions/TripCreated'
 *          '422':
 *             description: Error de validacion
 *             schema:
 *             $ref: "#/definitions/ErrorValidationResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.post('/v1/trips', trips.create_a_trip);
router.post('/v2/trips', auth.verifyUser(['MANAGER']),trips.create_a_trip);

/**
 * @swagger
 * 
 * /trips/fromManager/{managerId}:
 *    get:
 *       description: Get trips from Manager
 *       operationId: read_trips_fromManager
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: managerId
 *            description: Find trips from managerId
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/Trip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.route('/v1/trips/fromManager/:managerId').get(trips.read_trips_fromManager);

/**
 * @swagger
 * 
 * /trips/finder:
 *    get:
 *       description: Search trip using a finder. RequiredRoles-Explorer
 *       operationId: finder_trips
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: query
 *            name: actorId
 *            description: ActorId to use in search
 *            schema:
 *                type: string
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/TripsResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 */
router.get('/v1/trips/finder/:actorId', trips.finder_trips)

/**
 * @swagger
 * 
 * /trips/search:
 *    get:
 *       description: Search trip.RequiredRoles-any
 *       operationId: search_trips
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
 *             $ref: '#/definitions/TripsResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 */
 router.get('/v1/trips/search', trips.search_trips)

/**
 * @swagger
 * 
 * /trips/sponsorships:
 *    get:
 *       description: Get all sponsorship
 *       operationId: get_sponsorhips
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: query
 *            name: actorId
 *            description: Find sponsorships for this actor
 *            schema:
 *                type: string
 *                format: uuid
 *                required: true
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/TripsResponse'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.get('/v1/trips/sponsorships', trips.get_sponsorhips)
router.get('/v2/trips/sponsorships', auth.verifyUser(['SPONSOR']), trips.get_sponsorhips);



/**
 * @swagger
 * 
 * /trips/{tripId}:
 *    get:
 *       description: Get a trip 
 *       operationId: read_a_trip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Find trip with this id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/Trip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.get('/v1/trips/:tripId', trips.read_a_trip);

/**
 * @swagger
 * 
 * /trips/{tripId}:
 *    delete:
 *       description: Delete a trip 
 *       operationId: delete_a_trip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Delete trip with this id
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
router.delete('/v1/trips/:tripId', trips.delete_a_trip);
router.delete('/v2/trips/:tripId', auth.verifyUser(['MANAGER']),trips.delete_a_trip);

/**
 * @swagger
 * 
 * /trips/{tripId}:
 *    put:
 *       description: Update a trip 
 *       operationId: update_a_trip
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Update trip with this id
 *            type: string
 *          - in: body
 *            name: trip
 *            description: trip to update
 *            schema:
 *                $ref: "#/definitions/Trip"
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/Trip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.put('/v1/trips/:tripId', trips.update_a_trip);
router.put('/v2/trips/:tripId', auth.verifyUser(['MANAGER']), trips.update_a_trip);

 /**
 * @swagger
 * 
 * /trips/{tripId}/status:
 *    put:
 *       description: Change trip status
 *       operationId: change_status
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Update trip with this id
 *            type: string
 *          - in: query
 *            name: val
 *            description: new status value, one of this ['PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED']
 *            schema:
 *                $ref: "#/definitions/Trip"
 *          - in: query
 *            name: comment
 *            description: comentario con motivo de cancelation
 *            schema:
 *                type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/Trip'
 *          '500':
 *             description: Error interno del servidor
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.put('/v1/trips/:tripId/status', trips.change_status)
router.put('/v2/trips/:tripId/status', auth.verifyUser(['MANAGER']), trips.change_status)

/**
 * @swagger
 * 
 * /trips/{tripId}/sponsorships:
 *    post:
 *       description: a new sponsorship
 *       operationId: add_sponsorhips
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Add sponsohips to the trip with this id
 *            type: string
 *          - in: body
 *            name: sponsorship
 *            description: Sponsorship to add
 *            schema:
 *                $ref: "#/definitions/Sponsorship"
 *       responses:
 *          '201':
 *             description: Created
 *             schema:
 *                $ref: '#/definitions/TripCreated'
 *          '422':
 *             description: Error de validacion
 *             schema:
 *                $ref: "#/definitions/ErrorValidationResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.post('/v1/trips/:tripId/sponsorships', trips.add_sponsorhips)
router.post('/v2/trips/:tripId/sponsorships', auth.verifyUser(['SPONSOR']), trips.add_sponsorhips)

/**
 * @swagger
 * 
 * /trips/{tripId}/sponsorships/{sponsorshipId}:
 *    put:
 *       description: Update a sponsorship
 *       operationId: update_sponsorhips
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Trip with the sponsorship to update
 *            type: string
 *          - in: path
 *            name: sponsorshipId
 *            description: Sponsorship to update
 *            type: string
 *          - in: body
 *            name: sponsorship
 *            description: Sponsorship to update
 *            schema:
 *                $ref: "#/definitions/Sponsorship"
 *       responses:
 *          '201':
 *             description: Updated
 *             schema:
 *                $ref: '#/definitions/TripCreated'
 *          '422':
 *             description: Error de validacion
 *             schema:
 *                $ref: "#/definitions/ErrorValidationResponse"
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.put('/v1/trips/:tripId/sponsorships/:sponsorshipId', trips.update_sponsorhips)
router.put('/v2/trips/:tripId/sponsorships/:sponsorshipId', auth.verifyUser(['SPONSOR']), trips.update_sponsorhips)

/**
 * @swagger
 * 
 * /trips/{tripId}/sponsorships/{sponsorshipId}:
 *    get:
 *       description: Get a sponsorship
 *       operationId: get_a_sponsorhip
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Trip with the sponsorship 
 *            type: string
 *          - in: path
 *            name: sponsorshipId
 *            description: Sponsorship Id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/TripCreated'
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */

router.get('/v1/trips/:tripId/sponsorships/:sponsorshipId', trips.get_a_sponsorhip)
router.get('/v2/trips/:tripId/sponsorships/:sponsorshipId', auth.verifyUser(['SPONSOR']), trips.get_a_sponsorhip)

/**
 * @swagger
 * 
 * /trips/{tripId}/sponsorships/{sponsorshipId}:
 *    delete:
 *       description: Delete a sponsorship
 *       operationId: delete_sponsorhips
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Trip with the sponsorship 
 *            type: string
 *          - in: path
 *            name: sponsorshipId
 *            description: Sponsorship Id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/TripCreated'
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */

router.delete('/v1/trips/:tripId/sponsorships/:sponsorshipId', trips.delete_sponsorhips)
router.delete('/v2/trips/:tripId/sponsorships/:sponsorshipId', auth.verifyUser(['SPONSOR']), trips.delete_sponsorhips)

/**
 * @swagger
 * 
 * /trips/{tripId}/sponsorships/{sponsorshipId}/pay:
 *    put:
 *       description: Pay a sponsorship
 *       operationId: pay_sponsorhips
 *       parameters:
 *          - in: path
 *            name: tripId
 *            description: Trip with the sponsorship 
 *            type: string
 *          - in: path
 *            name: sponsorshipId
 *            description: Sponsorship Id
 *            type: string
 *       responses:
 *          '200':
 *             description: Success
 *             schema:
 *                $ref: '#/definitions/TripCreated'
 *          default:
 *             description: Error
 *             schema:
 *                $ref: "#/definitions/ErrorResponse"
 */
router.put('/v1/trips/:tripId/sponsorships/:sponsorshipId/pay', trips.pay_sponsorhips)
router.put('/v2/trips/:tripId/sponsorships/:sponsorshipId/pay', auth.verifyUser(['SPONSOR']), trips.pay_sponsorhips)


module.exports = router;
