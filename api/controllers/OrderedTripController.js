'use strict'
const mongoose = require('mongoose');
const OrderedTrip = mongoose.model('OrderedTrip');
const Trip = mongoose.model('Trip');

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
    Trip.findOne({ticker: new_orderedTrip.ticker}, function(err, trip){
        if(!trip){
            res.status(404).send({ message: `Trip with ticker ${new_orderedTrip.ticker} not found` });
                return;
        }else if(trip.status == 'STARTED' || trip.status == 'CANCELLED' || trip.status != 'PUBLISHED'){
            res.status(405).json({ message: 'You can`t apply to this trip' });
            return;
        }else{
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
            });
        }
    });
    
}

// /orderedTrips/search?actorId="id"&q="searchString"&sortedBy="status|actorId|ticker|date_apply"&reverse="false|true"&startFrom="valor"&pageSize="tam"
function search_orderedTrip(req, res) {
 //In further version of the code we will:
  //1.- control the authorization in order to include deleted items in the results if the requester is an Administrator.
  var query = {};
    
  if(req.query.actorId){
    query.actor_id=req.query.actorId;
  }
  if (req.query.q) {
    query.$text = {$search: req.query.q};
  }

  var skip=0;
  if(req.query.startFrom){
    skip = parseInt(req.query.startFrom);
  }
  var limit=0;
  if(req.query.pageSize){
    limit=parseInt(req.query.pageSize);
  }

  var sort="";
  if(req.query.reverse=="true"){
    sort="-";
  }
  if(req.query.sortedBy){
    sort+=req.query.sortedBy;
  }

  console.log("Query: "+query+" Skip:" + skip+" Limit:" + limit+" Sort:" + sort);

  OrderedTrip.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(function(err, orderedTrip){
    console.log('Start searching orderedTrip');
    if (err){
      res.send(err);
    }
    else{
      res.json(orderedTrip);
    }
    console.log('End searching orderedTrips');
  });
}

function read_an_orderedTrip(req, res){
    
    console.log('GET /v1/orderedTrips/:orderedTripId');
    OrderedTrip.find({_id: req.params.orderedTripId}, function(err, orderedTrips){
        if (err) res.send(err);
        else res.json(orderedTrips)
    });
}

function read_orderedTrip_fromManager(req, res) {
    console.log('GET /v1/orderedTrips/fromManager/:managerId');
    if (!req.params.managerId) return res.status(400).send({ message: 'Param ManagerId not found' });

    Trip.find({ manager: req.params.managerId },'ticker', function(err, trips) {
        if (err) return res.status(500).send(err);
        if (trips.length == 0) return res.send(trips);

        const arrayIds = trips.map(trip => trip.ticker);
        OrderedTrip.find({ 'ticker': {
           $in: arrayIds 
        }}, function(err, orderedTrip) {
            return res.send(orderedTrip);
        })
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
    let status = req.body.status;
    console.log('PUT /orderedTrips/:orderedTrip');

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
            if(req.body.status == "REJECTED" || req.body.status == "DUE") {
                if(orderedTrip[0].status != "PENDING") {
                    res.status(400).send({message: `La reserva ${orderedTrip[0].ticker} no se puede cambiar a ${status} ya que tiene el estado ${orderedTrip[0].status}`});
                    return;
                }
            }
            // Explorer action
            // new_status = CANCELLED and old_status= PENDING or ACCEPTED
            if(req.body.status == "CANCELLED"){
                if(orderedTrip[0].status != "PENDING" && orderedTrip[0].status != "ACCEPTED") {
                    res.status(400).send({message: `La reserva ${orderedTrip[0].ticker} no se puede cambiar a ${status} ya que tiene el estado ${orderedTrip[0].status}`});
                    return;
                }
            }
            OrderedTrip.findOneAndUpdate({_id: req.params.orderedTripId}, req.body, {new: true, runValidators: true}, function(err, orderedTrip) {
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
                if(orderedTrip[0].status != "PENDING" && orderedTrip[0].status != "ACCEPTED") {
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
    //let actorId = req.headers.authorization;
    let actorId = req.params.actorId;
    console.log(actorId);
    
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
                    if (orderedTrips.length == 0) return res.status(404).send({ message: `Actor with ID ${actorId} has not ordered trips` });
                    
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
    search_orderedTrip,
    read_an_orderedTrip,
    read_orderedTrip_fromManager,
    update_an_orderedTrip,
    delete_an_orderedTrip,
    change_status,
    search_by_status, 
    pay
}