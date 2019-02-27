'use strict'

const express = require('express');
const router = express.Router();
var dashboard = require('../controllers/dashboardController');

 /**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dashboard
	 * @type get post
	 * @url /dashboard
	 * @param [string] rebuildPeriod
	 * 
  */
router.get('/v1/dashboards', dashboard.list_all_indicators); 
router.post('/v1/dashboards', dashboard.rebuildPeriod);
	
	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dashboard
	 * @type get
	 * @url /dashboard/latest
	 * 
	*/
	router.get('/v1/dashboards/latest', dashboard.last_indicator);

 module.exports = router;
