'use strict'

const express = require('express')
const mongoose = require('mongoose');
const Actor = require('./models/ActorModel')
const portAPI = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoDBHostname = process.env.mongoDBHostname || 'localhost';
const mongoDBPort = process.env.mongoDBPort || 27017;
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer';
const mongoDBUri = "mongodb://"+mongoDBHostname+":"+mongoDBPort+"/"+mongoDBName;

mongoose.connect(mongoDBUri, {
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10,
    connectTimeoutMS: 10000,
    socketTimeout: 10000,
    family: 4,
    useNewUrlParser: true
});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const routesActor = require('./routes/actorRoutes');

routesActor(app);

mongoose.connection.on("open", function(err, conn) {
    app.listen(portAPI, function(){
        console.log("ACME-Explorer Restful API "+portAPI)
    })
});

mongoose.connection.on("error", function(err){
    console.log(err);
});