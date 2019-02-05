'use strict'
const mongoose = require('mongoose');
const Actor = mongoose.model('Actor');

function list_all_actors(req, res){
    
    Actor.find({}, function(err, actors){
        if (err) res.send(err);
        else res.json(actors)
    });
}

function create_an_actor(req, res){
    
    var new_actor = new Actor(req.body);    
    new_actor.save(function(err, actor){
        if (err) res.send(err);
        else res.json(actor);
    })
}

function read_an_actor(req, res){
    
    Actor.find({id_: req.params.actorId}, function(err, actors){
        if (err) res.send(err);
        else res.json(actors)
    });
}

function delete_an_actor(req, res){
    
    Actor.find({id_: req.params.actorId}, function(err, actors){
        if (err) res.send(err);
        else res.json(actors)
    });
}

function update_an_actor(req, res){
    
    Actor.find({id_: req.params.actorId}, function(err, actors){
        if (err) res.send(err);
        else res.json(actors)
    });
}

module.exports = {
    list_all_actors,
    create_an_actor,
    read_an_actor,
    update_an_actor,
    delete_an_actor
}