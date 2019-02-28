'use strict'

const express = require('express');
const router = express.Router();
const actors = require('../controllers/ActorController');
const middleware = require('../middlewares/middleware');

  /**
   * Get all actors
   *    Required role: Administrator
   * Post an actor 
   *    RequiredRoles: None
	 *
	 * @section actors
	 * @type get post
	 * @url /v1/actors
  */
router.get('/v1/actors', middleware.checkAdmin, actors.list_all_actors); 
router.post('/v1/actors', middleware.checkAdmin, actors.create_an_actor);


/**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
  */  
router.get('/v1/actors/:actorId', actors.read_an_actor);
router.put('/v1/actors/:actorId', actors.update_an_actor);
//router.delete('/v1/actors/:actorId', actors.delete_an_actor);



 /**
   * Ban an actor
   *    RequiredRoles: to be Administrator
	 *
	 * @section actors
	 * @type put
	 * @url /v1/actors/:actorId
   * @param {Boolean} value
  */  
 router.put('/v1/actors/:actorId/banned', middleware.checkAdmin, actors.change_banned_status);

 router.get('/v1/actors/:actorId/finder', actors.show_actor_finder);

 router.put('/v1/actors/:actorId/finder', actors.update_actor_finder);

 router.delete('/v1/actors/:actorId/finder', actors.delete_actor_finder);

module.exports = router;
