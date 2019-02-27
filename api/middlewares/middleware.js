'use strict'

const mongoose = require('mongoose');
const Actor = mongoose.model('Actor');

//check if the trip actor is a manager

function checkManager(req, res, next) {

    var actorId = req.params.actorId;
    Actor.findById({ _id: actorId }, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            if (actor.role[0] != 'MANAGER')
                res.status(500).send({ errors: "Actor it's not a manager"});
            else
                next()
        }
    });
}

module.exports = {
    checkManager
}