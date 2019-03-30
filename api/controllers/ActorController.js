'use strict'
const mongoose = require('mongoose');
const Actor = mongoose.model('Actor');
var admin = require('firebase-admin');
var authController = require('./authController');

//list actors

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

function login_an_actor(req, res) {
    console.log('starting login an actor');
    var emailParam = req.query.email;
    var password = req.query.password;
    Actor.findOne({ email: emailParam }, function (err, actor) {
        if (err) { res.send(err); }

        // No actor found with that email as username
        else if (!actor) {
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({ message: 'forbidden', error: err });
        }

        else if ((actor.role.includes('MANAGER')) && (actor.validated == false)) {
            res.status(403); //an access token is valid, but requires more privileges
            res.json({ message: 'forbidden', error: err });
        }

        else if ((actor.role.includes('EXPLORER')) && (actor.banned == true)) {
            res.status(403); //an access token is valid, but requires more privileges
            res.json({ message: 'forbidden', error: err });
        }

        else {
            // Make sure the password is correct
            //console.log('En actor Controller pass: '+password);
            actor.verifyPassword(password, async function (err, isMatch) {
                if (err) {
                    res.send(err);
                }

                // Password did not match
                else if (!isMatch) {
                    //res.send(err);
                    res.status(401); //an access token isn’t provided, or is invalid
                    res.json({ message: 'forbidden', error: err });
                }

                else {
                    try {
                        var customToken = await admin.auth().createCustomToken(actor.email);
                    } catch (error) {
                        console.log("Error creating custom token:", error);
                    }
                    actor.customToken = customToken;
                    console.log('Login Success... sending JSON with custom token');
                    res.json(actor);
                }
            });
        }
    });
};

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

function update_an_actor_v1(req, res) {
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

function update_an_actor_v2(req, res) {
    //Manager and Explorer can update theirselves, administrators can update any actor
    Actor.findById(req.params.actorId, async function (err, actor) {
        if (err) {
            res.send(err);
        }
        else {
            console.log('actor: ' + actor);
            var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
            if (actor.role.includes('EXPLORER') || actor.role.includes('MANAGER')) {
                var authenticatedUserId = await authController.getUserId(idToken);
                if (authenticatedUserId == req.params.actorId) {
                    Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            res.json(actor);
                        }
                    });
                } else {
                    res.status(403); //Auth error
                    res.send('The Actor is trying to update an Actor that is not himself!');
                }
            } else if (actor.role.includes('ADMINISTRATOR')) {
                Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json(actor);
                    }
                });
            } else {
                res.status(405); //Not allowed
                res.send('The Actor has unidentified roles');
            }
        }
    });

};



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
    update_an_actor_v1,
    update_an_actor_v2,
    delete_an_actor,
    change_banned_status,
    show_actor_finder,
    update_actor_finder,
    delete_actor_finder,
    search_actors,
    login_an_actor
}