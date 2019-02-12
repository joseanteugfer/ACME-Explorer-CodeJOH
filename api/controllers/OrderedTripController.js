'use strict'
const mongoose = require('mongoose');
const OrderedTrip = mongoose.model('OrderedTrip');

function list_all_orderedTrip(req, res){
    
    OrderedTrip.find({}, function(err, orderedTrips){
        if (err) res.send(err);
        else res.json(orderedTrips)
    });
}

function create_an_orderedTrip(req, res){
    
    var new_orderedTrip = new OrderedTrip(req.body);    
    new_orderedTrip.save(function(err, orderedTrip){
        if (err) res.send(err);
        else res.json(orderedTrip);
    })
}

function read_an_orderedTrip(req, res){
    
    OrderedTrip.find({_id: req.params.orderedTripId}, function(err, orderedTrips){
        if (err) res.send(err);
        else res.json(orderedTrips)
    });
}

function delete_an_orderedTrip(req, res){
    
    OrderedTrip.remove({_id: req.params.orderedTripId}, function(err, orderedTrip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'OrderedTrip successfully deleted' });
        }
    });
}

function update_an_orderedTrip(req, res){
    
    OrderedTrip.findOneAndUpdate({_id: req.params.orderedTripId}, req.body, {new: true}, function(err, orderedTrip) {
        if (err){
            res.send(err);
        }
        else{
            res.json(orderedTrip);
        }
    });
}

function change_status(req,res){
 // new-status = REJECTED and old_status= PENDING
 //new_status = DUE and old_status=PENDING
 //new_status = CANCELLED and old_status= PENDING or ACCEPTED
}

function search_by_status(req,res){
    //devolver la lista de los trips 
}

function pay(req,res){

}

module.exports = {
    list_all_orderedTrip,
    create_an_orderedTrip,
    read_an_orderedTrip,
    update_an_orderedTrip,
    delete_an_orderedTrip,
    change_status,
    search_by_status
}