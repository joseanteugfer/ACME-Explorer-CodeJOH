'use strict'

const express = require('express');
const router = express.Router();
var actors = require('../controllers/ActorController')

router.get('/actors', actors.list_all_actors);
router.post('/actors', actors.create_an_actor);

router.get('/actors/:actorId', actors.read_an_actor);
router.delete('/actors/:actorId', actors.delete_an_actor);
router.put('/actors/:actorId', actors.update_an_actor);

module.exports = router;
