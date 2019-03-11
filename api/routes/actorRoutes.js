'use strict'

const express = require('express');
const router = express.Router();
const actors = require('../controllers/ActorController');
const middleware = require('../middlewares/middleware');
const authController = require('../controllers/authController');


/**
 * 
 * @swagger
 * 
 * definitions:
 *   ErrorValidationResponse:
 *     required:
 *      - message
 *      - name
 *     properties:
 *       message:
 *         type: string
 *       name:
 *         type: string
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
 *   Actor:
 *     type: object
 *     required:
 *       - name
 *       - surname
 *       - email
 *       - password
 *       - role
 *     properties:
 *       name:
 *         type: string
 *         description: nombre del actor
 *       surname:
 *         type: string
 *         description: apellido del actor
 *       email: 
 *         type: string
 *         description: email del actor
 *         format: email
 *       password:
 *         type: string
 *         description: password del actor
 *       preferredLanguage:
 *         type: string
 *         description: lenguaje preferido
 *       phone:
 *         type: string
 *         description: teléfono del actor
 *       address:
 *         type: string
 *         description: dirección del actor
 *       paypal:
 *         type: string
 *         description: dirección email del paypal del actor
 *       role:
 *         type: string
 *         description: rol del actor en el sistema
 *         enum: ['MANAGER', 'EXPLORER', 'ADMINISTRATOR', 'SPONSOR']
 *       validated:
 *         type: boolean
 *         description: estado de validación de un Manager
 *       banned:
 *         type: boolean
 *         description: estado de la cuenta de un actor
 *       created:
 *         type: string
 *         format: date
 *         description: fecha de creación del actor
 *       finder:
 *         type: object
 *         description: objeto que guarda las preferencias de búsqueda de un actor
 *         properties:
 *           keyword:
 *             type: string
 *             description: palabra clave para realizar la búsqueda
 *           priceRangeMin:
 *             type: number
 *             description: precio mínimo de los viajes que el actor quiere que aparezcan en la búsqueda
 *           priceRangeMax:
 *             type: number
 *             description: precio máximo de los viajes que el actor quiere que aparezcan en la búsqueda
 *           dateRangeStart:
 *             type: string
 *             format: date
 *             description: los viajes que aparezca deben tener una fecha de inicio como mímimo igual a ésta
 *           dateRangeEnd:
 *             type: string
 *             format: date
 *             description: los viajes que aparezca deben tener una fecha de inicio como máximo igual a ésta
 *   ActorCreated:
 *     type: object
 *     required:
 *       - name
 *       - surname
 *       - email
 *       - password
 *       - role
 *     properties:
 *       _id:
 *         type: number
 *         description: ID
 *       _v:
 *         type: number
 *       name:
 *         type: string
 *         description: nombre del actor
 *       surname:
 *         type: string
 *         description: apellido del actor
 *       email: 
 *         type: string
 *         description: email del actor
 *         format: email
 *       password:
 *         type: string
 *         description: password del actor
 *       preferredLanguage:
 *         type: string
 *         description: lenguaje preferido
 *       phone:
 *         type: string
 *         description: teléfono del actor
 *       address:
 *         type: string
 *         description: dirección del actor
 *       paypal:
 *         type: string
 *         description: dirección email del paypal del actor
 *       role:
 *         type: string
 *         description: rol del actor en el sistema
 *         enum: ['MANAGER', 'EXPLORER', 'ADMINISTRATOR', 'SPONSOR']
 *       validated:
 *         type: boolean
 *         description: estado de validación de un Manager
 *       banned:
 *         type: boolean
 *         description: estado de la cuenta de un actor
 *       created:
 *         type: string
 *         format: date
 *         description: fecha de creación del actor
 *       finder:
 *         type: object
 *         description: objeto que guarda las preferencias de búsqueda de un actor
 *         properties:
 *           keyword:
 *             type: string
 *             description: palabra clave para realizar la búsqueda
 *           priceRangeMin:
 *             type: number
 *             description: precio mínimo de los viajes que el actor quiere que aparezcan en la búsqueda
 *           priceRangeMax:
 *             type: number
 *             description: precio máximo de los viajes que el actor quiere que aparezcan en la búsqueda
 *           dateRangeStart:
 *             type: string
 *             format: date
 *             description: los viajes que aparezca deben tener una fecha de inicio como mímimo igual a ésta
 *           dateRangeEnd:
 *             type: string
 *             format: date
 *             description: los viajes que aparezca deben tener una fecha de inicio como máximo igual a ésta
 *   ActorsResponse:
 *     type: array
 *     items:
 *       $ref: "#/definitions/Actor"
 *   ActorFinder:
 *     type: object
 *     properties: 
 *       keyword:
 *         type: string
 *         description: palabra clave para realizar la búsqueda
 *       priceRangeMin:
 *         type: number
 *         description: precio mínimo de los viajes que el actor quiere que aparezcan en la búsqueda
 *       priceRangeMax:
 *         type: number
 *         description: precio máximo de los viajes que el actor quiere que aparezcan en la búsqueda
 *       dateRangeStart:
 *         type: string
 *         format: date
 *         description: los viajes que aparezca deben tener una fecha de inicio como mímimo igual a ésta
 *       dateRangeEnd:
 *         type: string
 *         format: date
 *         description: los viajes que aparezca deben tener una fecha de inicio como máximo igual a ésta
 */

/**
 * 
 * @swagger
 * 
 * /actors:
 *     get:
 *       description: Returns all actors
 *       operationId: list_all_actors
 *       parameters:
 *         - in: header
 *           name: authorization
 *           schema:
 *             type: string
 *             format: uuid
 *             required: true
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/ActorsResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"

*/
router.get('/v1/actors', middleware.checkAdmin, actors.list_all_actors);

router.get('/v1/login', actors.login_an_actor);

/**
 * 
 * @swagger
 * 
 * /actors:
 *     post:
 *       description: Crea un actor
 *       operationId: create_an_actor
 *       consumes:
 *         - application/json
  *       parameters:
 *         - in: header
 *           name: authorization
 *           schema:
 *             type: string
 *             format: uuid
 *             required: true
 *         - in: body
 *           name: actor
 *           description: actor a crear
 *           schema:
 *             $ref: "#/definitions/Actor"       
 *       responses:
 *         '201':
 *           description: Created
 *           schema:
 *             $ref: '#/definitions/ActorCreated'
 *         '422':
 *           description: Error de validacion
 *           schema:
 *             $ref: "#/definitions/ErrorValidationResponse"
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"

*/
router.post('/v1/actors', middleware.checkAdmin, actors.create_an_actor);

/**
 * @swagger
 * 
 * /actors/search:
 *    get:
 *       description: Search actors.RequiredRoles-Admin
 *       operationId: search_actors
 *       consumes:
 *          - application/json
 *       parameters:
 *         - in: header
 *           name: authorization
 *           schema:
 *             type: string
 *             format: uuid
 *             required: true
 *         - in: query
 *           name: q
 *           description: Keyword to find in name, surname, phone or findeder keyword
 *           schema:
 *             type: string
 *         - in: query
 *           name: startFrom
 *           description: Return results from this point
 *           schema:
 *             type: number
 *         - in: query
 *           name: pageSize
 *           description: Return this amount of results
 *           schema:
 *             type: number
 *         - in: query
 *           name: sortedBy
 *           description: Sort by this surname, banned or created
 *           schema:
 *             type: string
 *         - in: query
 *           name: reverse
 *           description: (true|false)
 *           schema:
 *             type: string
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
router.get('/v1/actors/search', middleware.checkAdmin, actors.search_actors);

/**
 * 
 * @swagger
 * 
 * /actors/{actorId}:
 *   get:
 *     description: Devuelve un actor
 *     operationId: read_an_actor
 *     parameters:
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Actor'
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '404':
 *         description: No encontrado
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"   
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.get('/v1/actors/:actorId', actors.read_an_actor);

/**
 * 
 * @swagger
 * 
 * /actors/{actorId}:
 *   put:
 *     description: Actualiza un actor
 *     operationId: update_an_actor
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *       - in: body
 *         name: actor
 *         description: actor a actualizar
 *         schema:
 *           $ref: "#/definitions/Actor"
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       '422':
 *         description: Error de validacion
 *         schema:
 *           $ref: "#/definitions/ErrorValidationResponse"  
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '404':
 *         description: No encontrado
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"  
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.put('/v1/actors/:actorId', actors.update_an_actor_v1);

router.put('/v2/actors/:actorId', authController.verifyUser(["ADMINISTRATOR","MANAGER","EXPLORER"]), actors.update_an_actor_v2); //Manager y Explorer no puede modificar la info de otro consumer/clerk



/**
 * 
 * @swagger
 * 
 * /actors/{actorId}:
 *   delete:
 *     description: Elimina un actor
 *     operationId: delete_an_actor
 *     parameters:
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.delete('/v1/actors/:actorId', actors.delete_an_actor);



/**
 * 
 * @swagger
 * 
 * /actors/{actorId}/banned:
 *   put:
 *     description: Cambia el valor del atributo 'banned' de un actor
 *     operationId: change_banned_status
 *     consumes:
 *       - application/octet-stream
 *     parameters:
 *       - in: header
 *         name: authorization
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *       - name: value
 *         type: boolean
 *         in: query
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Actor'
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '404':
 *         description: No encontrado
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"  
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"   
 */
router.put('/v1/actors/:actorId/banned', middleware.checkAdmin, actors.change_banned_status);

/**
 * 
 * @swagger
 * 
 * /actors/{actorId}/finder:
 *   get:
 *     description: Devuelve el finder de un actor
 *     operationId: show_actor_finder
 *     parameters:
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/ActorFinder'
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '404':
 *         description: No encontrado
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"  
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.get('/v1/actors/:actorId/finder', actors.show_actor_finder);

/**
 * 
 * @swagger
 * 
 * /actors/{actorId}/finder:
 *   put:
 *     description: Actualiza el finder de un actor
 *     operationId: update_actor_finder
 *     parameters:
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *       - in: body
 *         name: actor
 *         description: actor a actualizar
 *         schema:
 *           $ref: "#/definitions/ActorFinder"
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/ActorFinder'
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '404':
 *         description: No encontrado
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '422':
 *         description: Error de validacion
 *         schema:
 *           $ref: "#/definitions/ErrorValidationResponse"  
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.put('/v1/actors/:actorId/finder', actors.update_actor_finder);

/**
 * 
 * @swagger
 * 
 * /actors/{actorId}/finder:
 *   delete:
 *     description: Rellena a null todos los campos del finder de un actor
 *     operationId: delete_actor_finder
 *     parameters:
 *       - name: actorId
 *         type: string
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         description: Success
 *         schema:
 *           $ref: '#/definitions/Actor'
 *       '500':
 *         description: Error interno del servidor
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       '404':
 *         description: No encontrado
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"  
 *       default:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */
router.delete('/v1/actors/:actorId/finder', actors.delete_actor_finder);


module.exports = router;
