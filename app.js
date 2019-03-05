'use strict'

const express = require('express')
const mongoose = require('mongoose');
const Actor = require('./api/models/ActorModel');
const Trip = require('./api/models/tripModel');
const OrderedTrip = require('./api/models/OrderedTripModel');
const Dashboard = require('./api/models/dashboardModel');
const DashboardTools = require('./api/controllers/dashboardController')
const portAPI = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const admin = require('firebase-admin');
const serviceAccount = require('./acme-explorer-code-joh-firebase-admin.json');


const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Test API',
      version: '1.0.0',
      description: 'Test Express API with autogenerated swagger doc',
    },
    basePath: '/v1',
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./api/routes/*.js'],
};

const specs = swaggerJsdoc(options);

// MongoDB URI building
var mongoDBUser = process.env.mongoDBUser || 'acmeExplorerUser';
var mongoDBPass = process.env.mongoDBPass || 'explorer';
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

const mongoDBHostname = process.env.mongoDBHostname || 'localhost';
const mongoDBPort = process.env.mongoDBPort || 27017;
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer';
var mongoDBUser = process.env.mongoDBUser || "acmeExplorerUser";
var mongoDBPass = process.env.mongoDBPass || "explorer";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;

mongoose.connect(mongoDBURI, {
  reconnectTries: 10,
  reconnectInterval: 500,
  poolSize: 10,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  family: 4,
  useNewUrlParser: true
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.get('/swagger.json', function(req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(specs);
//   });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, idToken" //ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
  );
  //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://acme-explorer-code-joh.firebaseio.com"
});

const routers = require('./api/routes');

routers.forEach((router) => {
  app.use(router);
});

mongoose.connection.on("open", function (err, conn) {
  app.listen(portAPI, function () {
    console.log('------------');
    console.log(`API Restful ACME-Explorer listen in http://localhost:${portAPI}`);
    console.log('------------');
    console.log(`API docs listen in http://localhost:${portAPI}/api-docs`);
    console.log('------------');
  })
});

mongoose.connection.on("error", function (err) {
  console.log(err);
});

DashboardTools.createDashboardJob();