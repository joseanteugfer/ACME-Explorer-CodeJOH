'use strict'
const mongoose = require('mongoose');
const Config = mongoose.model('Config');

function save_config(req, res) {
    var newConfig = new Config(req.body);    
    newConfig.save(function(err, config){
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
        }
        else res.json(config);
    })
}

function update_config(req, res){
    
    Config.findOneAndUpdate({_id: req.params.configId}, req.body, function(err, config) {
        if (err){
            if(err.name=='ValidationError') {
                res.status(422).send(err);
            }
            else{
              res.status(500).send(err);
            }
        }
        else{
            res.json(config);
        }
    });
}

module.exports = {
    save_config, 
    update_config
}