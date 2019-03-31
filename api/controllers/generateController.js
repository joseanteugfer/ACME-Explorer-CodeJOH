'use strict'

const mongoose = require('mongoose');
const moment = require('moment');
const generate = require('nanoid/generate');

const Actor = mongoose.model('Actor'),
    Config = mongoose.model('Config'),
    Trip = mongoose.model('Trip'),
    OrderedTrip = mongoose.model('OrderedTrip');


async function generateData(req, res) {

    console.log('Generate Config');
    var promiseConfig = () => {
        return new Promise((resolve, reject) => {
            var config = new Config({
                "numberResults" : 10,
                "searchPeriod" : 1
            });
            config.save(function (err, c) {
                if (err) {
                    console.log("Error " + err);
                    reject(null);
                }
                resolve(c);
            });
        })
    }
    await promiseConfig();

    console.log('Generating actors');
    var allActors = [];
    var generalCount = 1;
    generalCount = createActorByRole('ADMINISTRATOR', 2, allActors, generalCount);
    generalCount = createActorByRole('MANAGER', 3, allActors, generalCount);
    generalCount = createActorByRole('EXPLORER', 20, allActors, generalCount);
    generalCount = createActorByRole('SPONSOR', 4, allActors, generalCount);
    var promiseActor = () => {
        return new Promise((resolve, reject) => {
            Actor.insertMany(allActors, function (err, actors) {
                if (err) {
                    console.log("Error saving actors: " + err);
                    reject(err);
                }
                else {
                    console.log("Actors saved");
                    resolve(actors);
                }
            });
        })
    }
    var actors = await promiseActor();

    let managersList = actors.filter( actor => actor.role[0] == 'MANAGER');
    let sponsorsList= actors.filter( actor => actor.role[0] == 'SPONSOR');
    
    console.log("Generate trips");
    const titleList = ['Madrid', 'Sevilla', 'Barcelona', 'Vigo', 'Huelva', 'Oporto', 'Berlin', 'Viena', 'Paris', 'Roma'];
    const statusList = ['CREATED', 'PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED'];
    var tripsList = [];
    for (let i = 0; i < 150; i++) {
        const title = getRandomData(titleList);
        const manager = getRandomData(managersList);
        const tripInfo = generateTripsInfo(manager);
        const stages = generateStages(title);
        var trip = {
            "requirements": [],
            "ticker": getTicker(tripInfo.startDate),
            "status": getRandomData(statusList),
            "title": title,
            "manager": manager._id,
            "description": title + ' trip',
            "date_start": tripInfo.startDate,
            "date_end": tripInfo.endDate,
            "price": calculatePrice(stages),
            "stages": stages, 
            "sponsorships": generateSponsorships(getRandomData(sponsorsList))
        }
        tripsList.push(trip);
    }
    var promiseTrips = () => {
        return new Promise((resolve, reject) => {
            Trip.insertMany(tripsList, function (err, trips) {
                if (err) {
                    console.log("Error saving trips: " + err);
                    reject(err);
                }
                else {
                    console.log("Trips saved");
                    resolve(trips);
                }
            });
        })
    }
    let tripsFromDB = await promiseTrips();
    tripsFromDB = tripsFromDB.filter( trip => trip.status == 'PUBLISHED');
    
    let explorersList = actors.filter( actor => actor.role[0] == 'EXPLORER');
    
    console.log("Creating ordered trips");
    var statusOrderedList = ['PENDING', 'REJECTED','DUE','ACCEPTED','CANCELLED'];
    var comments = ["Comment1", "Comment2", "Comment3"];
    var orderedTripsList = [];
    for (let i = 0; i < 500; i++) {
        const trip = getRandomData(tripsFromDB);
        const explorer = getRandomData(explorersList);
        var orderedTrip = {
            "status" : getRandomData(statusOrderedList), 
            "date_apply" : generateDateApply(trip.date_start), 
            "ticker" : trip.ticker, 
            "actor_id" : explorer._id, 
            "comments" : getRandomData(comments)
        }
        orderedTripsList.push(orderedTrip);
    }
    var promiseOrderedTrips = () => {
        return new Promise((resolve, reject) => {
            OrderedTrip.insertMany(orderedTripsList, function (err, orderedTrips) {
                if (err) {
                    console.log("Error saving orderedTrips: " + err);
                    reject(err);
                }
                else {
                    console.log("orderedTrips saved");
                    resolve(orderedTrips);
                }
            });
        })
    }
    await promiseOrderedTrips();

    res.send("Data saved");
}


function createActorByRole(role, count, listToSave, generalCount) {
    const actorsNameList = ['Ana', 'Beatriz', 'Juan', 'Jose', 'Carlos', 'Pablo', 'Isabel'];
    const actorsSurnameList = ['Gonzalez', 'Rivas', 'Fdez', 'Ramos', 'Garcia', 'Romero', 'Reyes'];
    const phoneList = ['34522345', '12362346', '625625465', '63634634636'];
    const passwordList = ['password', 'password2', 'password3', 'password4'];
    const preferredLanguagesList = ['es', 'en'];
    const addressList = ['Reina Mercedes 1', "Reina Mercedes 2", "Pabellon Br1", "Pabellon br2", "Paseo de las Delicias", "Paseo de las Delicias"];
    const titleList = ['Madrid', 'Sevilla', 'Barcelona', 'Vigo', 'Huelva', 'Oporto', 'Berlin', 'Viena', 'Paris', 'Roma'];

    for (let i = 0; i < count; i++) {
        var name = getRandomData(actorsNameList);
        var surname = getRandomData(actorsSurnameList);
        var priceRange = getRandomRangePrice();
        var dateRange = getRandomRangeDate();
        var actor = {
            "name": name,
            "surname": surname,
            "email": (name + surname + generalCount + "@gmail.com").toLowerCase(),
            "password": getRandomData(passwordList),
            "preferredLanguages": getRandomData(preferredLanguagesList),
            "phone": getRandomData(phoneList),
            "address": getRandomData(addressList),
            "paypal": (name + surname + i + "@gmail.com").toLowerCase(),
            "role": [
                role
            ],
            "validated": true,
            "banned": false,
            "customToken": "nostrud",
            "created": getRandomDate(),
            "finder": {
                "keyword": getRandomData(titleList),
                "priceRangeMin": priceRange.min,
                "priceRangeMax": priceRange.max,
                "dateRangeStart": dateRange.start,
                "dateRangeEnd": dateRange.end
            }
        }
        listToSave.push(actor);
        generalCount = generalCount + 1;
    }
    return generalCount;

}

function getRandomRangeDate(){
    var random = Math.floor(Math.random() * (35));
    var random2 = Math.floor(Math.random() * (40-4)+4);
    var start = moment().add(Math.max(1, random), 'days');
    var end = moment().add(Math.max(random2, random+5), 'days');
    return {
        'start': start,
        'end': end
    }
}

function getRandomRangePrice(){
    var priceMin = Math.floor(Math.random() * (100 - 50) + 50);
    return {
        "min": priceMin,
        "max": priceMin + Math.floor(Math.random() * (100 - 50) + 50)
    }
}

function getTicker(createdDate){
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let randomletters = generate(alphabet,4);
    let now = moment(createdDate).format("YYMMDD");
    return `${now}-${randomletters}`;
}

function calculatePrice(stages){
    return stages.map((stage) => {
        return stage.price
    }).reduce((sum, price) => {
        return sum + price;
    });
  }

function generateStages(title) {
    //Math.floor(Math.random() * (high - low) + low)
    var stagesToGenerate = Math.floor(Math.random() * (7 - 3) + 3)
    var stages = [];
    for (let i = 1; i < stagesToGenerate; i++) {
        var stage = {
            "title": "Stage" + i + " - " + title,
            "description": "Stage number " + i + " for trip to " + title,
            "price": Math.floor(Math.random() * (400 - 50) + 50)
        }
        stages.push(stage);
    }
    return stages;
}

const linksList = ["http://link1.com", "http://link2.com", "http://link3.com", "http://link4.com"];
const bannersList = ["http://banners1.com", "http://banners2.com", "http://banners3.com", "http://banners4.com"]
function generateSponsorships(actor){
    var sponsorshipsToGenerate = Math.floor(Math.random() * (5 - 1) + 1)
    var sponsorships = [];
    for (let i = 1; i < sponsorshipsToGenerate; i++) {
        var sponsorship = {
            link: getRandomData(linksList),
            banner: getRandomData(bannersList),
            actorId: actor._id,
            payed: false
        }
        sponsorships.push(sponsorship);
    }
    return sponsorships;
    
}
function generateTripsInfo(manager) {
    //start date of trips created by this manager should be greater than the manager creation date
    var managerCreatedDate = manager.created;
    var random1 = Math.floor(Math.random() * (365 * 2));
    var startDate = moment(managerCreatedDate).add(random1, 'days');
    //Math.floor(Math.random() * (high - low) + low)
    var random2 = Math.floor(Math.random() * (15 - 5) + 5);
    return {
        'startDate': new Date(startDate.format('YYYY-MM-DD')),
        'endDate': new Date(startDate.add(random2, 'days').format('YYYY-MM-DD'))
    };
}

function generateDateApply(dateStart){
    //apply date for trips should be greater than dateStart of trip
    //Math.floor(Math.random() * (high - low) + low)
    var random = Math.floor(Math.random() * (15-5 ) + 5);
    return moment(dateStart).add(random, 'days');
}

function getRandomData(list) {
    var random = Math.floor(Math.random() * (list.length));
    return list[random];
}
function getRandomDate() {
    var random = Math.floor(Math.random() * (365 * 3));
    return moment().subtract(random, 'days');
}



module.exports = {
    generateData
}