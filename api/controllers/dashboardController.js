'use strict'
var async = require("async");
var mongoose = require('mongoose'),
    Actor = mongoose.model('Actor'),
    OrderedTrip = mongoose.model('OrderedTrip'),
    Trip = mongoose.model('Trip'),
    Dashboard = mongoose.model('Dashboard');

exports.list_all_indicators = function (req, res) {
    console.log('Requesting indicators');

    Dashboard.find().sort("-computationMoment").exec(function (err, indicators) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(indicators);
        }
    });
};

exports.last_indicator = function (req, res) {

    Dashboard.find().sort("-computationMoment").limit(1).exec(function (err, indicators) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(indicators);
        }
    });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *';  //El que se usará por defecto
var computeDashboardJob;

exports.rebuildPeriod = function (req, res) {
    console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod);
    rebuildPeriod = req.query.rebuildPeriod;
    computeDashboardJob.setTime(new CronTime(rebuildPeriod));
    computeDashboardJob.start();
    res.json(req.query.rebuildPeriod);
};

function createDashboardJob() {
    computeDashboardJob = new CronJob(rebuildPeriod, function () {

        var newDashboard = new Dashboard();
        console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod);
        async.parallel([
            computeTripsPerManager,
            computeOrderedtripsPerTrips,
            computePricePerTrips,
            computeRatioOrderedtrips,
            computeavgPriceRangeFinders,
            computeTopKeywordsFinders
        ], function (err, results) {
            if (err) {
                console.log("Error computing datawarehouse: " + err);
            }
            else {
                //console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
                newDashboard.tripsPerManager = results[0];
                newDashboard.orderedtripsPerTrips = results[1];
                newDashboard.pricePerTrips = results[2];
                newDashboard.ratioOrderedtrips = results[3];
                newDashboard.avgPriceRangeFinders = results[4];
                newDashboard.topKeywordsFinders = results[5];
                newDashboard.rebuildPeriod = rebuildPeriod;

                newDashboard.save(function (err, dashboard) {
                    if (err) {
                        console.log("Error saving dashboard information: " + err);
                    }
                    else {
                        console.log("new dashboard succesfully saved. Date: " + new Date());
                    }
                });
            }
        });
    }, null, true, 'Europe/Madrid');
}

module.exports.createDashboardJob = createDashboardJob;

function computeTripsPerManager(callback) {
    Trip.aggregate([
        {
            $group: {
                _id: "$manager",
                countTrips: { $sum: 1 }
            }
        }, {
            $group: {
                _id: null,
                minTripsManager: { $min: "$countTrips" },
                maxTripsManager: { $max: "$countTrips" },
                avgTripsManager: { $avg: "$countTrips" },
                stdDevTripsManager: { $stdDevPop: "$countTrips" }
            }
        },{
        $project: {
            _id: 0,
            minTripsManager: "$minTripsManager" ,
            maxTripsManager: "$maxTripsManager",
            avgTripsManager: "$avgTripsManager",
            stdDevTripsManager: "$stdDevTripsManager" 
        }
    }], function (err, res) {
            callback(err, res[0]);
        });
};

function computeOrderedtripsPerTrips(callback) {
    OrderedTrip.aggregate([
        {
            $facet: {
                "nOrderedTripByTicker": [
                    {$group: {
                         _id: "$ticker",
                         nOrderedTrip: {"$sum": 1} 
                        }
                    }
                ],
                "nOrderedTripTotal": [
                    {$group: {
                         _id: null,
                         nOrderedTrip: {"$sum": 1} 
                        }
                    },
                    {$project: {
                         _id: 0,   
                         nOrderedTrip: 1
                    }
                    }	
                ]
           }
        },
        {$project: {
            totalOrderedTrips: { $arrayElemAt: [ "$nOrderedTripTotal.nOrderedTrip", 0 ] },
            minOrderedTrips: {$min: "$nOrderedTripByTicker.nOrderedTrip"},
            maxOrderedTrips: {$max: "$nOrderedTripByTicker.nOrderedTrip"},
            avgOrderedTrips: {$avg: "$nOrderedTripByTicker.nOrderedTrip"},
            stdDevOrderedTrips: {$stdDevPop: "$nOrderedTripByTicker.nOrderedTrip"}
        }}
    ], function(err,res){
        callback(err, res[0]);
    });
};

function computePricePerTrips(callback) {
    Trip.aggregate([
        { 
            $group: {
                _id: null,
			       minPrice: { $min: "$price" },
			       maxPrice: { $max: "$price" },
			       avgPrice: { $avg: "$price" },
			       stdDevPrice: { $stdDevPop: "$price" }
    	 }
    }, {$project: {
        _id: 0,
        minPrice: "$minPrice" ,
        maxPrice: "$maxPrice",
        avgPrice: "$avgPrice",
        stdDevPrice: "$stdDevPrice" 
    }}
    ], function(err,res){
        callback(err, res[0]);
    });
};

function computeRatioOrderedtrips(callback) {
    OrderedTrip.aggregate([
        {$facet:{
            totalOrderedTrips: [{$group: {_id: null, totalOrders: {"$sum":1}}}],
            nOrderedTripsPending: [
            {$match: { status: "PENDING"}},
            {$group: {_id: null, totalOrders: {"$sum": 1}}}],
            nOrderedTripsRejected: [
            {$match: { status: "REJECTED"}},
            {$group: {_id: null, totalOrders: {"$sum": 1}}}],
            nOrderedTripsDue: [
            {$match: { status: "DUE"}},
            {$group: {_id: null, totalOrders: {"$sum": 1}}}],
            nOrderedTripsAccepted: [
            {$match: { status: "ACCEPTED"}},
            {$group: {_id: null, totalOrders: {"$sum": 1}}}],
            nOrderedTripsCancelled: [
            {$match: { status: "CANCELLED"}},
            {$group: {_id: null, totalOrders: {"$sum": 1}}}],
            }
        },
        {$project: {
            _id:0,
            ratioOrderedTripPending: { $divide: [{$arrayElemAt: [ "$nOrderedTripsPending.totalOrders", 0 ]}, {$arrayElemAt: [ "$totalOrderedTrips.totalOrders", 0 ]} ]},
            ratioOrderedTripRejected: { $divide: [{$arrayElemAt: [ "$nOrderedTripsRejected.totalOrders", 0 ]}, {$arrayElemAt: [ "$totalOrderedTrips.totalOrders", 0 ]} ]},
            ratioOrderedTripDue: { $divide: [{$arrayElemAt: [ "$nOrderedTripsDue.totalOrders", 0 ]}, {$arrayElemAt: [ "$totalOrderedTrips.totalOrders", 0 ]} ]},
            ratioOrderedTripAccepted: { $divide: [{$arrayElemAt: [ "$nOrderedTripsAccepted.totalOrders", 0 ]}, {$arrayElemAt: [ "$totalOrderedTrips.totalOrders", 0 ]} ]},
            ratioOrderedTripCancelled: { $divide: [{$arrayElemAt: [ "$nOrderedTripsCancelled.totalOrders", 0 ]}, {$arrayElemAt: [ "$totalOrderedTrips.totalOrders", 0 ]} ]}
            }
        },
        {$project: {
            ratioOrderedTripPending: {
                 $cond: {
                     if: {$eq: [null, "$ratioOrderedTripPending"]},
                     then: 0,
                     else: "$ratioOrderedTripPending"
                     }   
                },
            ratioOrderedTripRejected: {
                 $cond: {
                     if: {$eq: [null, "$ratioOrderedTripRejected"]},
                     then: 0,
                     else: "$ratioOrderedTripRejected"
                     }   
                },
            ratioOrderedTripDue: {
                 $cond: {
                     if: {$eq: [null, "$ratioOrderedTripDue"]},
                     then: 0,
                     else: "$ratioOrderedTripDue"
                     } 
                },
            ratioOrderedTripAccepted: {
                 $cond: {
                     if: {$eq: [null, "$ratioOrderedTripAccepted"]},
                     then: 0,
                     else: "$ratioOrderedTripAccepted"
                     }   
                },
            ratioOrderedTripCancelled: {
                 $cond: {
                     if: {$eq: [null, "$ratioOrderedTripCancelled"]},
                     then: 0,
                     else: "$ratioOrderedTripCancelled"
                     }   
                }
            }
        } 
    ],function(err,res){
        callback(err, res[0]);
    });
};

function computeavgPriceRangeFinders(callback) {
    Actor.aggregate([
        {
            $project:
            {
                priceRange: { $subtract: ["$finder.priceRangeMax", "$finder.priceRangeMin"] }
            }
        },
        {
            $group:
            {
                _id: null,
                avgPriceRangeFinders: { $avg: "$priceRange" }
            }
        },
        {
            $project:
                { _id: 0, avgPriceRangeFinders: 1 }
        }]

        , function (err, res) {
            var avgPriceRange = res[0].avgPriceRangeFinders;
            callback(err, avgPriceRange);
        });
};

function computeTopKeywordsFinders(callback) {
    //Top 10 keywords y finder

    Actor.aggregate([
        {
            $project:
            {
                "finder.keyword": 1
            }
        },
        {
            $facet: {
                preComputation: [
                    {
                        $group: {
                            _id: null,
                            numKeywords: { $sum: 1 }
                        }
                    },
                    { $project: { _id: 0, limitTopPercentage: { $ceil: { $multiply: ["$numKeywords", 0.1] } } } }
                ],
                keywords: [{ $group: { _id: "$finder.keyword", keywordSum: { $sum: 1 } } }, { $project: { _id: 0, keyword: "$_id", keywordSum: 1 } }, { $sort: { "keywordSum": -1 } }]
            }
        },
        { $project: { topKeywords: { $slice: ["$keywords", { $arrayElemAt: ["$preComputation.limitTopPercentage", 0] }] } } }]

        , function (err, res) {
            callback(err, res);
        });

};

