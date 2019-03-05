'use strict'
const mongoose = require('mongoose');
const Actor = mongoose.model('Actor');

function list_all_actors(req, res) {
    console.log(`GET /actors`);
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
    console.log(`POST /actors`)
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
            console.log('Actor con id: ' + actor._id + 'creado.');
        }
    });
}

function read_an_actor(req, res) {
    var actorId = req.params.actorId;
    console.log(`GET /actors/${actorId}`);
    Actor.findOne({ _id: actorId }, function (err, actor) {
        if (!actor) return res.status(404).send({ message: `Actor with ID ${actorId} not found` });
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(actor);
        }
    })

}

function delete_an_actor(req, res) {
    var actorId = req.params.actorId;
    console.log(`DELETE /actors/${actorId}`);
    Actor.findOneAndDelete({ _id: actorId }, function (err, actor) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json({ message: "The actor with id: " + actorId + " was successfully deleted" });
        }
    });
}

function update_an_actor(req, res) {
    var actorId = req.params.actorId;
    console.log(`PUT /actors/${actorId}`);
    Actor.findOneAndUpdate({ _id: actorId }, req.body, { runValidators: true, new: true, context: 'query' }, function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                return res.status(422).send(err);
            }
            else {
                return res.status(500).send(err);
            }
        }
        if (!actor) return res.status(404).send({ message: `Actor with ID ${actorId} not found` });

        res.json(actor);
    });
}

function change_banned_status(req, res) {
    var banned_value = req.query.value;
    //check auth user is ['ADMINISTRATOR'], otherwise return 403
    var actorId = req.params.actorId;
    console.log(`PUT /actors/${actorId}/banned`);
    Actor.findOneAndUpdate({ _id: actorId }, { $set: { banned: banned_value } }, { new: true }, function (err, actor) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!actor) return res.status(404).send({ message: `Actor with ID ${actorId} not found` });

        res.json(actor);
    });
}

function show_actor_finder(req, res) {
    var actorId = req.params.actorId;
    console.log(`GET /actors/${actorId}/finder`);
    Actor.findOne({ _id: actorId }, function (err, actor) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!actor) return res.status(404).send({ message: `Actor with ID ${actorId} not found` });

        res.json(actor.finder);
    });
}

function update_actor_finder(req, res) {
    var actorId = req.params.actorId;
    console.log(`PUT /actors/${actorId}/finder`);
    Actor.findOneAndUpdate({ _id: actorId }, { $set: { finder: req.body } }, { runValidators: true, new: true, context: 'query' }, function (err, actor) {
        if (err) {
            if (err.name == 'ValidationError') {
                return res.status(422).send(err);
            }
            else {
                return res.status(500).send(err);
            }
        }
        if (!actor) return res.status(404).send({ message: `Actor with ID ${ractorId} not found` });


        res.json(actor.finder);
    });
}

function delete_actor_finder(req, res) {
    var new_finder = {
        "keyword": null,
        "priceRangeMin": null,
        "priceRangeMax": null,
        "dateRangeStart": null,
        "dateRangeEnd": null
    };
    var actorId = req.params.actorId;
    console.log(`DELETE /actors/${actorId}/finder`);
    Actor.findOneAndUpdate({ _id: actorId }, { $set: { finder: new_finder } }, { new: true }, function (err, actor) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!actor) return res.status(404).send({ message: `Actor with ID ${actorId} not found` });

        res.json(actor);
    });
}

// /actors/search?q="searchString"&sortedBy="surname|banned|created"&reverse="false|true"&startFrom="valor"&pageSize="tam"
function search_actors(req, res) {
    var query = {};

    if (req.query.q) {
        query.$text = { $search: req.query.q };
    }

    var skip = 0;
    if (req.query.startFrom) {
        skip = parseInt(req.query.startFrom);
    }
    var limit = 0;
    if (req.query.pageSize) {
        limit = parseInt(req.query.pageSize);
    }

    var sort = "";
    if (req.query.reverse == "true") {
        sort = "-";
    }
    if (req.query.sortedBy) {
        sort += req.query.sortedBy;
    }

    console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit + " Sort:" + sort);

    Actor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(function (err, actor) {
            console.log('Start searching actors');
            if (err) {
                return res.status(500).send(err);
            }
            else {
                res.json(actor);
            }
            console.log('End searching actors');
        });
}

module.exports = {
    list_all_actors,
    create_an_actor,
    read_an_actor,
    update_an_actor,
    delete_an_actor,
    change_banned_status,
    show_actor_finder,
    update_actor_finder,
    delete_actor_finder,
    search_actors
}