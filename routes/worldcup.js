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
 
  router.get("/matches", function(req, res) {
  //  request('http://api.football-api.com/2.0/competitions?Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76',(err,resp,bod)=>{
  //    logInfo("Error: " + err +'\n' + "Response:"+resp+'\n'+"Body:"+tableify(bod));
  //    let html = tableify(bod);
  //    res.send(html);
  //  });
  res.send(tableify(matches));
  
  });
  
  function logInfo(info){
    console.log(info);
  }
  
  
  module.exports = router;