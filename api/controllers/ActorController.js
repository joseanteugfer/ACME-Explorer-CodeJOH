'use strict'
const mongoose = require('mongoose');
const Actor = mongoose.model('Actor');

function list_all_actors(req, res) {

    Actor.find({}, function (err, actors) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(actors);
        }
    });
}

function create_an_actor(req, res) {

    var new_actor = new Actor(req.body);
    new_actor.save(function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.status(201).json(actor);
        }
    });
}

function read_an_actor(req, res) {
    Actor.find({ _id: req.params.actorId }, function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(actor);
        }
    })

}

function delete_an_actor(req, res) {

    Actor.findOneAndDelete({ _id: req.params.actorId }, function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json({ message: "The actor: " + actor + " was successfully deleted"});
        }
    });
}

function update_an_actor(req, res) {

    Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { runValidators: true, new: true }, function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(actor);
        }
    });
}

function change_banned_status(req, res) {
    var banned_value = req.query.value;
    //check auth user is ['ADMINISTRATOR'], otherwise return 403
    Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { banned: banned_value } }, { new: true }, function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else {
            res.json(actor);
        }
    });
}


module.exports = {
    list_all_actors,
    create_an_actor,
    read_an_actor,
    update_an_actor,
    delete_an_actor,
    change_banned_status
}