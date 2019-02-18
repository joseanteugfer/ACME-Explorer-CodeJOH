'use strict'
const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

function list_all_trips(req, res) {
    //if auth user is ['MANAGER', 'ADMINISTRATOR'], list all trips
    //if auth user is ['EXPLORER','SPONSOR'], list ['PUBLISHED']
    Trip.find({}, function (err, trips) {
        if (err) res.send(err);
        else res.json(trips)
    });
}

function create_a_trip(req, res) {
    //status to CREATED(by default in schema definition)
    //check auth user is ['MANAGER'], otherwise return 403
    var new_trip = new Trip(req.body);
    //calculating the total price as sum of the stages prices
    new_trip.price = new_trip.stages.map((stage) => {
        return stage.price
    }).reduce((sum, price) => {
        return sum + price;
    });
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
        if (err) res.send(err);
        else res.json(trips)
    });
}

function delete_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //delete trip if it's not published
    Trip.findById({ _id: req.params.tripId }, function (err, trip) {
        if (!trip) {
            res.status(400).send({ message: `Trip with ID ${req.params.tripId} not found`});
            return;
        }
        if (trip.status != 'PUBLISHED') {
            Trip.deleteOne({ _id: req.params.tripId }, function (err, trip) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({ message: 'Trip successfully deleted' });
                }
            });
        } else {
            res.status(405).json({ message: 'Delete trip with status PUBLISHED is not allowed' });
        }
    });
}

function update_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    Trip.findById({ _id: req.params.tripId }, function (err, trip) {
        if (!trip) {
            res.status(400).send({ message: `Trip with ID ${req.params.tripId} not found`});
            return;
        }
        if (trip.status != 'PUBLISHED') {
            var tripUpdated = req.body;
            //calculating the total price as sum of the stages prices
            if (tripUpdated.stages) {
                tripUpdated.price = tripUpdated.stages.map((stage) => {
                    return stage.price
                }).reduce((sum, price) => {
                    return sum + price;
                });
            }
            Trip.findOneAndUpdate({ _id: req.params.tripId }, tripUpdated, { new: true, runValidators: true, context: 'query' }, function (err, trip) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        res.status(422).send(err);
                    }
                    else {
                        res.status(500).send(err);
                    }
                }
                else {
                    res.json(trip);
                }
            });
        } else {
            res.status(405).json({ message: 'Update trip with status PUBLISHED is not allowed' });
        }
    });
}

function search_trips(req, res) {
    //check if keyword,priceRangeMin, priceRangeMax, dateRangeStart, dateRangeEnd  param exists
    //Search depending on params
    //params can be null, in that case return all trips
    console.log('Searching trips depending on params');
    res.status(200).json('Trips returned from the trips search');
}

function change_status(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //change status to CANCEL if (PUBLISHED and not STARTED) and don't have any accepted application, otherwise return 405
    var new_status = req.query.val;
    Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { status: new_status } }, { new: true }, function (err, trip) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(trip);
        }
    });
}

function get_sponsorhips(req, res) {
    console.log('Getting all sponsorships for user');
    res.send('Sponsorships returned');
}

function add_sponsorhips(req, res) {
    console.log('Add sponsorship for user');
    res.send('Added sponsorship');
}
function update_sponsorhips(req, res) {
    console.log('Updated sponsorship for user');
    res.send('Updated sponsorship');
}
function delete_sponsorhips(req, res) {
    console.log('Deleted sponsorship for user');
    res.send('Deleted sponsorship');
}

function pay_sponsorhips(req, res) {
    console.log('Payed sponsorship for user');
    res.send('Payed sponsorship');
}

module.exports = {
    list_all_trips,
    create_a_trip,
    read_a_trip,
    update_a_trip,
    delete_a_trip,
    search_trips,
    change_status,
    get_sponsorhips,
    add_sponsorhips,
    update_sponsorhips,
    delete_sponsorhips,
    pay_sponsorhips
}
