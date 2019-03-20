'use strict'

const mongoose = require('mongoose');
const Actor = mongoose.model('Actor');

//check if the trip actor is a manager
function checkManager(req, res, next) {
    var actorId = req.headers.authorization;
    console.log(`CheckManager: ${actorId}`);
    if(!actorId) return res.status(400).send({ message: 'Authorization header not founded' });

    Actor.findById({ _id: actorId }, function (err, actor) {
        if (err) return res.status(500).send(err);
        if (!actor) return res.status(400).send({ message: `Manager with ID ${actorId} not found` });
        if (actor.role[0] != 'MANAGER') return res.status(500).send({ errors: `Actor with ID ${actorId} it's not a manager` });

        next();
        
    });
}

// check if the actor is a Administrator
function checkAdmin(req, res, next) {
    var actorId = req.headers.authorization;
    console.log(`CheckAdmin: ${actorId}`);
    if(!actorId) return res.status(400).send({ message: 'Authorization header not founded' });
    
    Actor.findById({ _id: actorId }, function (err, actor) {
        if (err) return res.status(500).send(err);
        if (!actor) return res.status(400).send({ message: `Administrator with ID ${actorId} not found` });
        if (actor.role[0] != 'ADMINISTRATOR') return res.status(500).send({ errors: `Actor with ID ${actorId} it's not a administrator` });
        
        next();
        
    });
}

// check if the actor is a Sponsor
function checkSponsor(req, res, next) {
    var actorId = req.headers.authorization;
    console.log(`CheckSponsor: ${actorId}`);
    if(!actorId) return res.status(400).send({ message: 'Authorization header not founded' });

    Actor.findById({ _id: actorId }, function (err, actor) {
        if (err) return res.status(500).send(err);
        if (!actor) return res.status(400).send({ message: `Sponsor wit ID ${actorId} not found` });
        if (actor.role[0] != 'SPONSOR') return res.status(400).send({ errors: `Actor with ID ${actorId} it's not a sponsor` });
        
        next();

    });
}

//check if the trip actor is a explorer
function checkExplorer(req, res, next) {
    var actorId = req.headers.authorization;
    console.log(`CheckExplorer: ${actorId}`);
    if(!actorId) return res.status(400).send({ message: 'Authorization header not founded' });

    Actor.findById({ _id: actorId }, function (err, actor) {
        if (err) return res.status(500).send(err);
        if (!actor) return res.status(400).send({ message: `Explorer with ID ${actorId} not found` });
        if (actor.role[0] != 'EXPLORER') return res.status(500).send({ errors: `Actor with ID ${actorId} it's not a explorer` });

        next();
        
    });
}

module.exports = {
    checkManager,
    checkAdmin,
    checkSponsor,
    checkExplorer
}