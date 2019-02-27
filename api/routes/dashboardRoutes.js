'use strict'

const express = require('express');
const router = express.Router();
var dashboard = require('../controllers/dashboardController');

/**
   * Get trips information:
   *    RequiredRoles: Administrator
   *
   * @section dashboards
   * @type get 
   * @url /v1/dashboards/general
  */
 router.get('/v1/dashboards/general', dashboard.get_dasboard)

 /**
   * Compute cube:
   *    RequiredRoles: Administrator
   *
   * @section dashboard
   * @type get 
   * @url /v1/dashboards/compute-cube
   * @param {string} period
  */
 router.get("/v1/dashboards/compute-cube", dashboard.compute_cube);

 module.exports = router;
