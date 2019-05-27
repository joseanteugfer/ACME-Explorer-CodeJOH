'use strict'
const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');
const Actor = mongoose.model('Actor');
const OrderedTrip = mongoose.model('OrderedTrip');
const Config = mongoose.model('Config');
const FinderCache = mongoose.model('FinderCache');
var async = require("async");
var moment = require('moment');

function getTripStatusByActorRole(actorId) {
    return function (callback) {
        Actor.findOne({ _id: actorId }, function (err, actor) {
            var status = null;
            if (!actor || actor.role == "EXPLORER" || actor.role == "SPONSOR")
                status = "PUBLISHED"
            callback(err, status);
        });
    };
}

function list_all_trips(req, res) {
    let actorId = req.headers.authorization;

    async.waterfall([
        getTripStatusByActorRole(actorId),
        function (tripStatus) {
            var query = {}
            if (tripStatus)
                query.status = tripStatus;
            Trip.find(query, function (err, trips) {
                if (err) res.send(err);
                else res.json(trips)
            });
        }
    ], function (error, success) {
        if (error) {
            res.status(500).send(error);
        }
    });
}

function create_a_trip(req, res) {
    //status to CREATED(by default in schema definition)
    var new_trip = new Trip(req.body);
    new_trip.save(function (err, trip) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else res.json(trip);
    })
}

function read_a_trip(req, res) {

    Trip.find({ _id: req.params.tripId }, function (err, trips) {
        if (err) res.status(500).send(err);
        else res.json(trips)
    });
}

function read_trips_fromManager(req, res) {

    Trip.find({ manager: req.params.managerId }, function (err, trips) {
        if (err) return res.status(500).send(err);

        return res.send(trips);
    });
}

function read_trips_fromTicker(req, res) {

    Trip.find({ ticker: req.params.ticker }, function (err, trips) {
        if (err) return res.status(500).send(err);

        console.log('trip from ticker: '+ trips.toString());
        return res.send(trips);
    });
}

function delete_a_trip(req, res) {

    Trip.findById({ _id: req.params.tripId }, function (err, trip) {
        if (!trip) {
            res.status(404).send({ message: `Trip with ID ${req.params.tripId} not found` });
            return;
        }
        if (trip.status != 'PUBLISHED') {
            Trip.deleteOne({ _id: req.params.tripId }, function (err, tripResult) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({
                        message: 'Trip successfully deleted',
                        trip: trip
                    });
                }
            });
        } else {
            res.status(405).json({ message: 'Delete trip with status PUBLISHED is not allowed' });
        }
    });
}

function update_a_trip(req, res) {

    //change status to CANCEL if (PUBLISHED and not started) and don't have any accepted application, otherwise return 405
    var new_status = req.body.status;

    Trip.findById({ _id: req.params.tripId }, function (err, trip) {
        if (trip.status != 'PUBLISHED') {
            if (new_status == 'CANCELLED') {

                if (!req.body.comments) return res.status(400).send({ message: 'You want to cancel trip. Field comments in request not found' });

                Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true, runValidators: true, context: 'query' }, function (err, tripUpdated) {
                    if (err) return res.send(err);
                    if (!tripUpdated) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });

                    return res.json(tripUpdated);

                });
            } else {
                var tripUpdated = req.body;
                //calculating the total price as sum of the stages prices

                Trip.findOneAndUpdate({ _id: req.params.tripId }, tripUpdated, { new: true, runValidators: true, context: 'query' }, function (err, trip) {
                    if (err) {
                        if (err.name == 'ValidationError') {
                            return res.status(422).send(err);
                        }
                        else {
                            return res.status(500).send(err);
                        }
                    }
                    if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });


                    res.json(trip);
                });
            }
        } else {
            res.status(405).json({ message: 'Update trip with status PUBLISHED is not allowed' });
        }
    });
}

async function finder_trips(req, res) {
    console.log('Searching trips depending on finder');

    //checking if actor have a search already in FinderCache
    var promiseFinderCache = () => {
        return new Promise((resolve, reject) => {
            FinderCache.findOne({ 'actor': req.params.actorId }, function (err, finderCache) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(finderCache);
                }
            });
        })
    }
    var finderCache = await promiseFinderCache();

    //we can use the results already defined in finderCache
    if (finderCache && moment(finderCache.expiresDate).isAfter(moment())) {
        console.log("Getting trips from cache");
        return res.send(finderCache.trips);
    }

    // getting the actor 
    var promiseActor = () => {
        return new Promise((resolve, reject) => {
            Actor.findById({ _id: req.params.actorId }, function (err, actor) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(actor);
                }
            });
        })
    }
    var actor = await promiseActor();

    //getting general configuration
    var promiseConfig = () => {
        return new Promise((resolve, reject) => {
            Config.find()
                .limit(1)
                .exec(function (err, config) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(config[0]);
                    }
                });
        })
    }
    var config = await promiseConfig();


    //finderCache is not available or it already expires, searching again
    var query = {};
    if (actor.finder.keyword)
        query.$text = { $search: actor.finder.keyword }
    if (actor.finder.dateRangeStart)
        query.date_start = { $gte: new Date(actor.finder.dateRangeStart) };
    if (actor.finder.dateRangeEnd)
        query.date_end = { $lte: new Date(actor.finder.dateRangeEnd) };
    if (actor.finder.priceRangeMin)
        query.price = { $gte: actor.finder.priceRangeMin };
    if (actor.finder.priceRangeMax) {
        if (query.price)
            query.price.$lte = actor.finder.priceRangeMax;
        else
            query.price = { $lte: actor.finder.priceRangeMax };
    }
    //get only trips with status PUBLISHED, allowed actors are EXPLORER
    query.status = "PUBLISHED";
    //getting the trips
    console.log('Getting new trips');
    var promiseTrips = () => {
        return new Promise((resolve, reject) => {
            Trip.find(query).limit(config.numberResults)
                .exec(function (err, trips) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(trips);
                    }
                });
        })
    }
    var trips = await promiseTrips();

    //we have a previous finderCache but the data already expires, deleting this to store the new one
    if (finderCache) {
        var promiseFinderCacheDelete = () => {
            return new Promise((resolve, reject) => {
                FinderCache.deleteOne({ _id: finderCache._id }, function (err, x) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            })
        }
        await promiseFinderCacheDelete();
    }

    //saving trips in finder

    var newFinderCache = new FinderCache({
        "trips": trips,
        "actor": actor._id,
        "expiresDate": moment().add(config.searchPeriod, 'hours')
    });
    newFinderCache.save(function (err, finderCacheNew) {
        // if (err) {
        //     if (err.name == 'ValidationError') {
        //         res.status(422).send(err);
        //     }
        //     else {
        //         res.status(500).send(err);
        //     }
        // }
        // else {
            res.send(trips);
        //}
    });

}

function search_trips(req, res) {
    console.log('Searching trips depending on params');

    let actorId = req.params.authorization;

    async.waterfall([
        getTripStatusByActorRole(actorId),
        function (tripStatus) {
            var query = {}
            if (tripStatus)
                query.status = tripStatus;
            if (req.query.keyword)
                query.$text = { $search: req.query.keyword }
            if (req.query.actor) {
                query.manager = req.query.actor;
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
            console.log(query);
            Trip.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(function (err, trip) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json(trip);
                    }
                });
        }
    ], function (error, success) {
        if (error) {
            res.status(500).send(error);
        }
    });

}

function change_status(req, res) {
    //change status to CANCEL if (PUBLISHED and not started) and don't have any accepted application, otherwise return 405
    var new_status = req.query.val;
    if (new_status == 'CANCELLED') {
        Trip.findById({ _id: req.params.tripId }, function (err, trip) {
            if (!trip) {
                res.status(404).send({ message: `Trip with ID ${req.params.tripId} not found` });
                return;
            } else if (trip.status == 'PUBLISHED') {
                OrderedTrip.findOne({ ticker: trip.ticker }, function (err, orderedTrip) {
                    if (orderedTrip) {
                        res.status(405).json({ message: 'Cancel trip with status PUBLISHED and a valid application is not allowed' });
                        return;
                    }
                    if (trip.date_start < Date.now()) {
                        res.status(405).json({ message: 'Cancel trip with status PUBLISHED and started is not allowed' });
                        return;
                    } else {
                        if (req.query.comment) {
                            Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { status: new_status, comment: req.query.comment } }, { new: true, runValidators: true }, function (err, tripUpdated) {
                                if (err) return res.send(err);
                                if (!tripUpdated) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });

                                return res.json(tripUpdated);

                            });
                        } else {
                            return res.status(400).send({ message: 'You want to cancel trip. Query param comment not found' });
                        }
                    }
                });
            } else {
                if (req.query.comment) {
                    Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { status: new_status, comment: req.query.comment } }, { new: true, runValidators: true }, function (err, tripUpdated) {
                        if (err) return res.send(err);
                        if (!tripUpdated) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });

                        return res.json(tripUpdated);

                    });
                } else {
                    return res.status(400).send({ message: 'You want to cancel trip. Query param comment not found' });
                }
            }
        });
    } else {
        Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { status: new_status } }, { new: true, runValidators: true }, function (err, trip) {
            if (err) return res.send(err);
            if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });

            res.json(trip);

        });
    }
}

function get_sponsorhips(req, res) {
    console.log('Getting all sponsorships for user');
    Trip.find({ 'sponsorships.actorId': req.query.actorId }, function (err, trips) {
        if (err) return res.status(500).send(err);

        res.send(trips);
    });

}
function get_a_sponsorhip(req, res) {
    console.log('Getting a sponsorship');
    Trip.findOne({ "_id": req.params.tripId, "sponsorships._id": req.params.sponsorshipId }, function (err, trip) {
        if (err) return res.status(500).send(err);
        if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId} not found` });

        res.send(trip);

    });

}

function add_sponsorhips(req, res) {
    let tripId = req.params.tripId;
    let sponsorId = req.body.actorId;
    console.log(`POST /trips/${tripId}/${sponsorId}/sponsorships`);

    let new_sponsor = req.body;
    new_sponsor.actorId = sponsorId;

    Trip.find({ _id: tripId }, function (err, trip) {
        if (err) return res.status(500).send(err);
        if (!trip[0]) return res.status(404).send({ message: `Trip with ID ${tripId} not found` });

        trip[0].sponsorships.push(new_sponsor);
        trip[0].save(function (err, trip) {
            if (err) {
                if (err.name == 'ValidationError') {
                    return res.status(422).send(err);
                }
                else {
                    return res.status(500).send(err);
                }
            }
            return res.send(trip);
        });

    });
}
function update_sponsorhips(req, res) {
    console.log('Updated sponsorship for user');

    Trip.findOneAndUpdate({ "_id": req.params.tripId, "sponsorships._id": req.params.sponsorshipId },
        { "$set": { "sponsorships.$": req.body } },
        function (err, trip) {
            if (err) return res.status(500).send(err);
            if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });

            res.send(trip);
        });
}
function delete_sponsorhips(req, res) {
    let tripId = req.params.tripId;
    let sponsorshipId = req.params.sponsorshipId;
    console.log(`DELETE /trips/${tripId}/sponsorships/${sponsorshipId}`);

    Trip.find({ _id: tripId }, function (err, trip) {
        if (err) return res.status(500).send(err);
        if (!trip[0]) return res.status(404).send({ message: `Trip with ID ${tripId} not found` });

        if (trip[0].sponsorships.length != 0) {
            for (let i = 0; i < trip[0].sponsorships.length; i++) {
                if (trip[0].sponsorships[i]._id == sponsorshipId) {
                    trip[0].sponsorships.splice(i, 1);
                }
            }
        }
        trip[0].save();
        return res.send(trip[0]);
    });
}

function pay_sponsorhips(req, res) {
    let tripId = req.params.tripId;
    let sponsorshipId = req.params.sponsorshipId;
    let encontrado = false;
    let pagado = false;
    console.log(`PUT /trips/${tripId}/sponsorships/${sponsorshipId}/pay`);

    Trip.findById({ _id: tripId }, function (err, trip) {
        if (!trip) return res.status(404).send({ message: 'Trip or Sponsorship not found' });

        var sponsors = trip.sponsorships;
        for (var i = 0; i < sponsors.length; i++) {
            if (sponsors[i]._id == sponsorshipId) {
                encontrado = true;
                if (sponsors[i].payed == true) {
                    pagado = true;
                    
                } else {
                    sponsors[i].payed = true;
                    trip.sponsorships = sponsors;
                    Trip.findOneAndUpdate({ "_id": tripId },
                        trip, function (err, tripUpdated) {
                            if (err) return res.status(500).send(err);
                            if (!tripUpdated) return res.status(404).send({ message: 'Trip or Sponsorship not found' });

                            return;
                        });
                }
            }
        }
        if (encontrado == true ) {
            
            if (pagado == false){
                return res.send(trip);
            }else{
                return res.send({ message: 'The Sponsorship is already payed' });
            }
        } else {
            return res.status(404).send({ message: 'Sponsorship not found' });
        }
    });
}

module.exports = {
    list_all_trips,
    create_a_trip,
    read_a_trip,
    read_trips_fromManager,
    update_a_trip,
    delete_a_trip,
    finder_trips,
    search_trips,
    change_status,
    get_sponsorhips,
    get_a_sponsorhip,
    add_sponsorhips,
    update_sponsorhips,
    delete_sponsorhips,
    pay_sponsorhips,
    read_trips_fromTicker
}
