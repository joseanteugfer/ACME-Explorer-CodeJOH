'use strict'

function get_dasboard(req, res){
    console.log('Get general information in dashboard');
    res.status(200).json('General info');
}

function compute_cube(req, res){
    console.log('Compute cube in dashboard');
    res.status(200).json('Compute cube');
}

module.exports ={
    get_dasboard, 
    compute_cube
}