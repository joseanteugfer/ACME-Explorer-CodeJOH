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
    req.body.manager = req.headers.authorization;
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
        if (err) res.send(err);
        else res.json(trips)
    });
}

function delete_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //delete trip if it's not published
    Trip.findById({ _id: req.params.tripId }, function (err, trip) {
        if (!trip) {
            res.status(404).send({ message: `Trip with ID ${req.params.tripId} not found`});
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
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    Trip.findById({ _id: req.params.tripId }, function (err, trip) {
        if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId} not found`});
            
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
                        return res.status(422).send(err);
                    }
                    else {
                        return res.status(500).send(err);
                    }
                }
                if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });

                res.json(trip);
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
    Trip.findOneAndUpdate({ _id: req.params.tripId }, { $set: { status: new_status } }, { new: true, runValidators: true }, function (err, trip) {
        if (err) return res.send(err);
        if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });
        
        res.json(trip);
        
    });
}

function get_sponsorhips(req, res) {
    console.log('Getting all sponsorships for user');
    Trip.find({ 'sponsorships.actorId': req.params.actorId }, function (err, trips) {
        if (err) return res.status(500).send(err);
        
        res.send(trips);
    });
    
}
function get_a_sponsorhip(req, res) {
    console.log('Getting a sponsorship');
    Trip.findOne({ "_id": req.params.tripId, "sponsorships._id": req.params.sponsorshipId }, function(err,trip) {
        if (err) return res.status(500).send(err);
        if (!trip) return res.status(404).send( { message: `Trip with ID ${req.params.tripId} not found` });
            
        res.send(trip);
        
    });
    
}

function add_sponsorhips(req, res) {
    let tripId = req.params.tripId;
    let sponsorId = req.headers.authorization;
    console.log(`POST /trips/${tripId}/${sponsorId}/sponsorships`);

    let new_sponsor = req.body;
    new_sponsor.actorId = sponsorId;

    Trip.find({_id: tripId }, function(err, trip){
        if (err) return res.status(500).send(err);
        if (!trip[0]) return res.status(404).send({ message: `Trip with ID ${tripId} not found` });

        trip[0].sponsorships.push(new_sponsor);
        trip[0].save(function(err, trip) {
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
    { "$set": { "sponsorships.$": req.body} },
    function(err,trip) {
        if (err) return res.status(500).send(err);
        if (!trip) return res.status(404).send({ message: `Trip with ID ${req.params.tripId}` });
        
        res.send(trip);
    });
}
function delete_sponsorhips(req, res) {
    let tripId = req.params.tripId;
    let sponsorshipId = req.params.sponsorshipId;
    console.log(`DELETE /trips/${tripId}/sponsorships/${sponsorshipId}`);

    Trip.find({_id: tripId }, function(err, trip){
        if (err) return res.status(500).send(err);
        if (!trip[0]) return res.status(404).send({ message: `Trip with ID ${tripId} not found` });
    
        if (trip[0].sponsorships.length != 0) {
            for(let i = 0; i < trip[0].sponsorships.length; i++) {
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
    console.log(`PUT /trips/${tripId}/sponsorships/${sponsorshipId}/pay`);
    
    Trip.findOneAndUpdate({ "_id": tripId, "sponsors._id": sponsorshipId },
    { "$set": { "sponsors.$.payed": true} }, function(err,trip) {
        if (err) return res.status(500).send(err); 
        if (!trip) return res.status(404).send({ message: 'Trip or Sponsorship not found' });

        res.send(trip);
    });
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
    get_a_sponsorhip,
    add_sponsorhips,
    update_sponsorhips,
    delete_sponsorhips,
    pay_sponsorhips
}
