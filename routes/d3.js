// Initialization
  //Node Packages Module
var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var phantomProxy = require('phantom-proxy');
var fs = require('fs');
var util = require('util');
var router = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var CR = String.fromCharCode(13);
let jsdom = require("jsdom");
let request = require('request');
let tableify = require('tableify');

//JSON DATA
let competitions = require('../JSON/competitions');
let commentaries = require('../JSON/commentaries');
let standings = require('../JSON/standings');
let teams = require('../JSON/teams');
let matches = require('../JSON/matches');
let players = require('../JSON/players');

// Set the port number
// router.listen(8095);
//Router usage: Log to the console time any http protocol gets used ( Get, Put , Post Delete )
router.use( (req,res,next) => {
    console.log('Time: ' , Date.now()); 
    next();
  });
router.get('/newmatch',(req,res)=>{
  request('http://www.worldcupapi.site/stadiums?apikey=a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a&lang=en',(err,resp,bod)=>{
    res.send(bod);
  });
});
router.get("/competitions", function(req, res) {
//  request('http://api.football-api.com/2.0/competitions?Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76',(err,resp,bod)=>{
//    logInfo("Error: " + err +'\n' + "Response:"+resp+'\n'+"Body:"+tableify(bod));
//    let html = tableify(bod);
//    res.send(html);
//  });
res.send(tableify(competitions));

});

router.get("/commentaries",function(req,res){
  res.send(tableify(commentaries));
});
router.get("/standings",function(req,res){
  res.send(tableify(standings));
});
router.get("/teams",function(req,res){
  res.send(tableify(teams));
});
router.get("/players",function(req,res){
  res.send(tableify(players));
});
router.get("/matches",function(req,res){
  res.send(tableify(matches));
});

router.get("/api/about", function(req, res) {
logInfo("About");
});

function logInfo(info){
  console.log(info);
}


module.exports = router;