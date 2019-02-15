const mongoose = require('mongoose');
const OrderedTrip = require('../api/models/OrderedTripModel');
const chai = require('chai');
const expect = chai.expect;

describe('MongoDB Tests Integration', () => {
    
    before((done) => {
        const mongoDBHostname = process.env.mongoDBHostname || 'localhost';
        const mongoDBPort = process.env.mongoDBPort || 27017;
        const mongoDBName = process.env.mongoDBName || 'ACME-Explorer-test';
        const mongoDBUri = "mongodb://"+mongoDBHostname+":"+mongoDBPort+"/"+mongoDBName;

        mongoose.connect(mongoDBUri);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            done();
        });       
    });

    after(() => {
        mongoose.connection.db.dropDatabase(() => {
            console.log(`La base de datos a sido eleminada: ${mongoDBUri}`);
            mongoose.connection.close(done);
        });
    });

    describe('OrderedTrip tests', () => {

        it('Save new OrderedTrip', (done) => {
            let newOrderedTrip = new OrderedTrip({
                'ticker': '190206-KSND',
                "status": "PENDING",
                "actor_id": "5c5ac431ea187e38a8089393",
                "comments": "Viaje con senderismo"
            });
            newOrderedTrip.save((err) => {
                expect(err).to.not.exist;
                done();
            })
        });

        it('Save status OrderedTrip with error validation of status', (done) => {
            let newOrderedTrip = new OrderedTrip({
                'ticker': '190206-KSND',
                "status": "Hola",
                "actor_id": "5c5ac431ea187e38a8089393",
                "comments": "Viaje con senderismo"
            });
            newOrderedTrip.save((err) => {
                expect(err).to.exist;
                done();
            })
        });

        it('Update status OrderedTrip with error validation of status', (done) => {
            OrderedTrip.findOneAndUpdate({_id: '5c668e57271fe138907d2451'}, {status: 'Hola'}, {new: true, runValidators: true}, function(err, orderedTrip) {
                expect(err).to.exist;
                done();
            });
        });

        it('Save ticker OrderedTrip with error validation of ticker', (done) => {
            let newOrderedTrip = new OrderedTrip({
                'ticker': 'test',
                "status": "PENDING",
                "actor_id": "5c5ac431ea187e38a8089393",
                "comments": "Viaje con senderismo"
            });
            newOrderedTrip.save((err) => {
                expect(err).to.exist;
                done();
            })
        });
        

        it('GET OrderedTrip', (done) => {
            OrderedTrip.find(function(err, orderedTrips){
                if (err) done(err);
                expect(orderedTrips).to.have.lengthOf.at.least(1);
                done();
            });
        });
    });

});