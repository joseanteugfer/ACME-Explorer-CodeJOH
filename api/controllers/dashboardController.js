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
var rebuildPeriod = '0 0 * * * * *';  //El que se usará por defecto
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
    var r = {
        minTripsManager: 0,
        maxTripsManager: 0,
        avgTripsManager: 0,
        stdDevTripsManager: 0
    };
    var err = false
    callback(err, r);
};

function computeOrderedtripsPerTrips(callback) {
    var r = {
        minOrderedTrips: 0,
        maxOrderedTrips: 0,
        avgOrderedTrips: 0,
        stdDevOrderedTrips: 0
    };
    var err = false
    callback(err, r);
};

function computePricePerTrips(callback) {
    var r = {
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        stdDevPrice: 0
    };
    var err = false
    callback(err, r);
};

function computeRatioOrderedtrips(callback) {
    var r = 0;
    var err = false
    callback(err, r)
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

