'use strict'
module.exports = function(app) {
    var actors = require('../controllers/ActorController')

    app.route('/actors')
        .get(actors.list_all_actors)
        .post(actors.create_an_actor);

    app.route('/actors/:actorId')
        .get(actors.read_an_actor)
        .delete(actors.delete_an_actor)
        .put(actors.update_an_actor);

}

