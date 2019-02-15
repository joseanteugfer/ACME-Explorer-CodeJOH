'use strict'

const express = require('express');
const router = express.Router();
var dashboard = require('../controllers/dashboardController');

/**
   * Change trip order status:
   *    RequiredRoles: Administrator
   *
   * @section dashboard
   * @type get 
   * @url /v1/dashboard
  */
 router.put('/dashboard', dashboard.get_dasboard)

 module.exports = router;


 module.exports = router;
