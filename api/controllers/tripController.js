'use strict'
const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

function list_all_trips(req, res){
    
    Trip.find({}, function(err, trips){
        if (err) res.send(err);
        else res.json(trips)
    });
}

function create_a_trip(req, res){
    
    var new_trip = new Trip(req.body);    
    new_trip.save(function(err, trip){
        if (err) res.send(err);
        else res.json(trip);
    })
}

function read_a_trip(req, res){
    
    Trip.find({_id: req.params.tripId}, function(err, trips){
        if (err) res.send(err);
        else res.json(trips)
    });
}

function delete_a_trip(req, res){
    
    Trip.remove({_id: req.params.tripId}, function(err, trip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Trip successfully deleted' });
        }
    });
}

function update_a_trip(req, res){
    
    Trip.findOneAndUpdate({_id: req.params.tripId}, req.body, {new: true}, function(err, trip) {
        if (err){
            res.send(err);
        }
        else{
            res.json(trip);
        }
    });
}

function search_trips_keyword(res,req){

}

function change_status(req, res){

}

module.exports = {
    list_all_trips,
    create_a_trip,
    read_a_trip,
    update_a_trip,
    delete_a_trip,
    search_trips_keyword,
    change_status
}