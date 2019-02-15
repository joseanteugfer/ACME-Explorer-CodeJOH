'use strict'
const mongoose = require('mongoose');
const OrderedTrip = mongoose.model('OrderedTrip');

function list_all_orderedTrip(req, res){
    
    console.log('GET /orderedTrips');
    OrderedTrip.find({}, function(err, orderedTrips){
        if (err) res.send(err);
        else res.json(orderedTrips)
    });
}

function create_an_orderedTrip(req, res){
    
    console.log('POST /orderedTrips')
    var new_orderedTrip = new OrderedTrip(req.body);    
    new_orderedTrip.save(function(err, orderedTrip){
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
        }
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
    
    console.log('PUT /orderedTrips/:orderedTrip');
    OrderedTrip.findOneAndUpdate({_id: req.params.orderedTripId}, req.body, {new: true}, function(err, orderedTrip) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
        }
        else{
            res.json(orderedTrip);
        }
    });
}

function change_status(req,res){
    let orderedTripId = req.params.orderedTripId;
    let status = req.query.status;
    console.log(`PUT /orderedTrips/${orderedTripId}/status?status=${status}`);

    OrderedTrip.find({_id: req.params.orderedTripId}, function(err, orderedTrip){
        if (err) {
            if(err.name = "CastError") {
                res.status(422).send(err);
                return;
            }
            res.status(500).send(err);
            return;
        } else {
            if(orderedTrip.length == 0) {
                res.status(400).send({ message: `No se encuentra ninguna reserva con ID: ${orderedTripId}` });
                return;
            }
            // Manager action
            // new-status = REJECTED and old_status= PENDING
            // new_status = DUE and old_status=PENDING
            if(req.query.status == "REJECTED" || req.query.status == "DUE") {
                if(orderedTrip[0].status != "PENDING") {
                    res.status(400).send({message: `La reserva ${orderedTrip[0].ticker} no se puede cambiar a ${status} ya que tiene el estado ${orderedTrip[0].status}`});
                    return;
                }
            }
            // Explorer action
            // new_status = CANCELLED and old_status= PENDING or ACCEPTED
            if(req.query.status == "CANCELLED"){
                if(orderedTrip[0].status != "PENDING" || orderedTrip[0].status != "ACCEPTED") {
                    res.status(400).send({message: `La reserva ${orderedTrip[0].ticker} no se puede cambiar a ${status} ya que tiene el estado ${orderedTrip[0].status}`});
                    return;
                }
            }
            OrderedTrip.findOneAndUpdate({_id: orderedTripId}, {status: req.query.status}, {new: true, runValidators: true}, function(err, orderedTrip) {
                if (err){
                    if(err.name=='ValidationError') {
                        res.status(422).send(err);
                    }
                    else{
                      res.status(500).send(err);
                    }
                }
                else{
                    res.json(orderedTrip);
                }
            });
        }
    });
 
}

function search_by_status(req,res){
    let actorId = req.params.actorId;
    if (!req.query.groupBy) {
        res.status(400).send({ message: `Se debe especificar el parámetro groupBy en la URL` });
        return;
    }
    let groupBy = req.query.groupBy;
    console.log(`GET /orderedTrips/${actorId}/search?groupBy=${groupBy}`);

    if (groupBy != 'status') {
            res.status(400).send({ message: 'Valor de groupBy incorrecto', groupBy_values: ['status'] });
            return;
    }
    
    // Devolver la lista de los trips de un actor agrupados por el status
    OrderedTrip.find({ "actor_id": actorId }).sort({status: 1, "date_apply": -1})
                .exec(function(err, orderedTrips) {
                    if(err){
                        if(err.name = "CastError") {
                            res.status(422).send(err);
                            return;
                        }
                        res.status(500).send(err);
                        return;
                    }
                    res.send(orderedTrips);
                });
}

function pay(req,res){
    let orderedTripId = req.params.orderedTripId;
    console.log(`PUT /orderedTrips/${orderedTripId}/pay`);

    OrderedTrip.find({_id: orderedTripId}, function(err, orderedTrip) {
        if (err) {
            if(err.name = "CastError") {
                res.status(422).send(err);
                return;
            }
            res.status(500).send(err);
            return;
        } else {
            if(orderedTrip.length == 0) {
                res.status(400).send({ message: `No se encuentra ninguna reserva con ID: ${orderedTripId}` });
                return;
            }
            if (orderedTrip[0].status != "DUE") {
                res.status(400).send({ message: `La reserva contiene está en estado ${orderedTrip[0].status}. Por lo que no se puede pagar` });
                return;
            } 
            OrderedTrip.findOneAndUpdate({_id: orderedTripId}, {status: 'ACCEPTED'}, {new: true, runValidators: true}, function(err, orderedTrip) {
                if (err){
                    if(err.name=='ValidationError') {
                        res.status(422).send(err);
                    }
                    else{
                      res.status(500).send(err);
                    }
                }
                else{
                    res.json(orderedTrip);
                }
            });
        }
    })
}

module.exports = {
    list_all_orderedTrip,
    create_an_orderedTrip,
    read_an_orderedTrip,
    update_an_orderedTrip,
    delete_an_orderedTrip,
    change_status,
    search_by_status,
    pay
}