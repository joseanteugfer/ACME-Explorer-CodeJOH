'use strict'

const express = require('express');
const router = express.Router();
var dashboard = require('../controllers/dashboardController');

 /**
 * 
 * @swagger
 * 
 * definitions:
 *   ErrorResponse:
 *     required:
 *       - message
 *     properties:
 *       message:
 *         type: string
 *   DashboardResponse:
 *       type: array
 *       items:
 *          $ref: "#/definitions/Dashboard"
 *   RebuildResponse:
 *        type: string
 *   Dashboard:
 *       type: object
 *       properties:
 *          _id:
 *             type: string
 *             description: id
 *          _v:
 *             type: string
 *             description: V
 *          ordertripsPerTrips:
 *             type: object
 *             description: Orderedtrips per trips
 *             properties:
 *                totalOrderedTrips:
 *                    type: number
 *                minOrderedTrips:
 *                    type: number
 *                maxOrderedTrips:
 *                    type: number
 *                avgOrderedTrips:
 *                    type: number
 *                stdDevOrderedTrips:
 *                    type: number
 *          pricePerTrips:
 *             type: string
 *             description: Price indicators
 *             properties:
 *                minPrice:
 *                    type: number
 *                maxPrice:
 *                    type: number
 *                avgPrice:
 *                    type: number
 *                stdDevPrice:
 *                    type: number
 *          ratioOrderedTrips:
 *             type: string
 *             description: Ratio ordered trips indicator
 *             properties:
 *                 ratioOrderedTripPending:
 *                     type: number
 *                 ratioOrderedTripRejected:
 *                     type: number
 *                 rationOrderedTripDue:
 *                     type: number
 *                 ratioOrderedTripAccepted:
 *                     type: number
 *                 ratioOrderedTripCancelled:
 *                     type: number
 *          avgPriceRangeFinders:
 *             type: number
 *             description: Average Price Range in actor finder
 *          totalKeywordsFinders:
 *             type: array
 *             description: Top ten keywords in finders
 *             items:
 *               type: object
 *               properties:
 *                   keyword:
 *                       type: string
 *                   keywordSum:
 *                       type: number
 *          computationMoment:
 *             type: Date
 *          rebuildPeriod:
 *             type: string
 *          tripsPerManager:
 *             type: object
 *             description: Trips per manager
 *             properties:
 *                 minTripsManager:
 *                    type: number
 *                 maxTripsManager:
 *                    type: number
 *                 avgTripsManager:
 *                    type: number
 * 				   stdDevTripsManager:
 * 					  type: number
 
 */

 /**
 * 
 * @swagger
 * 
 * /dashboards:
 *     get:
 *       description: Returns all indicators in dashboard
 *       operationId: list_all_indicators
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/DashboardsResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"

*/
router.get('/v1/dashboards', dashboard.list_all_indicators); 

/**
 * 
 * @swagger
 * 
 * /dashboards:
 *     post:
 *       description: Set the build period
 *       operationId: rebuildPeriod
 *       parameters:
 *          - in: query
 *            name: rebuildPeriod
 *            description: Rebuild period for dashboard computations
 *            schema:
 *                type: string
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/RebuildResponse'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"

*/
router.post('/v1/dashboards', dashboard.rebuildPeriod);

/**
 * 
 * @swagger
 * 
 * /dashboards/latest:
 *     get:
 *       description: Returns lastest indicators in dashboard
 *       operationId: last_indicator
 *       responses:
 *         '200':
 *           description: Success
 *           schema:
 *             $ref: '#/definitions/Dashboard'
 *         '500':
 *           description: Error interno del servidor
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
 *         default:
 *           description: Error
 *           schema:
 *             $ref: "#/definitions/ErrorResponse"
*/

router.get('/v1/dashboards/latest', dashboard.last_indicator);

 module.exports = router;
