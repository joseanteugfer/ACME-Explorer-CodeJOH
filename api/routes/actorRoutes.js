'use strict'
module.exports = function(app) {
    var actors = require('../controllers/ActorController')

    app.route('/actors')
        .get(actors.list_all_actors)
        .post(actors.create_an_actor);

<<<<<<< HEAD
    app.route('/actors/:actorId')
        .get(actors.read_an_actor)
        .delete(actors.delete_an_actor)
        .put(actors.update_an_actor);

}
=======
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
router.get('/actors', actors.list_all_actors); 
router.post('/actors', actors.create_an_actor);


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
router.get('/actors/:actorId', actors.read_an_actor);
router.put('/actors/:actorId', actors.update_an_actor);
//router.delete('/actors/:actorId', actors.delete_an_actor);



 /**
   * Ban an actor
   *    RequiredRoles: to be Administrator
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
   * @param {Boolean} value
  */  
 router.put('/actors/:actorId/banned', actors.change_banned_status)
>>>>>>> development

