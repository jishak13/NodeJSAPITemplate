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
  let promise = require('request-promise');
  let db2 = require('../db2');
  //Geocoders
  let getCoords = require('city-to-coords');
  let geocoder  = require('geocoder');
  let googlecoder   = require('google-geocoder');
  let nodecoder  = require('node-geocoder');

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
    let postOptions = {
      uri: 'http://www.worldcupapi.site/matches?apikey=a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a',
      method: 'POST',
      headers: {
        distributor:'sbuild-worldcup',
        verifiedcode: 'sb-a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a',
        'Content-Type': 'application/json'
      }
    }
    request(postOptions,(err,resp,bod)=>{
     logInfo("Error: " + err +'\n' + "Response:"+resp+'\n'+"Body:"+bod);
    //  console.log(resp);
      let html = tableify(JSON.parse(bod).matches[0]);
     res.send(html);
  
    });
  });
  
  // Route for React App to call that updates the data pertaining to Stadiums in the database
  router.get("/stadiums", function(req, res) {
      let results = [];
      let html = '';
      let stadiums = [];
      let postOptions = {
        uri: 'http://www.worldcupapi.site/stadiums?apikey=a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a',
        method: 'POST',
        headers: {
          distributor:'sbuild-worldcup',
          verifiedcode: 'sb-a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a',
          'Content-Type': 'application/json'
        }
      };
    
      request(postOptions,(err,resp,bod) => {
       logInfo("Error: " + err +'\n' + "Response:"+resp+'\n'+"Body:"+bod);
        results = JSON.parse(bod).stadiums;
        stadiums =  results.map( stadium => {
          return {
            stadium:stadium.stadium,
            city:stadium.city
          }
        });

        // console.log('Stadiums',stadiums);

      coordResults = stadiums.map(stadium=>{
        console.log('Stadium',stadium);
         getCoords(stadium.city).then((coords)=>{
          console.log(stadium, coords);
         addCoords(stadium.stadium,stadium.city,coords);
       })
      });
  
        res.send(coordResults);
    });
  });
  
  router.get('/teams',(req,res)=>{

      let postOptions = {
        uri: 'http://www.worldcupapi.site/Teams?apikey=a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a',
        method: 'POST',
        headers:{
          distributor:'sbuild-worldcup',
          verifiedcode: 'sb-a5edd31293441eef3119a650211d4a1acd0c57214cbd1d3a',
          'Content-Type': 'application/json'
        }
      };
  
      request(postOptions,(err,resp,bod)=>{
       logInfo("Error: " + err +'\n' + "Response:"+resp+'\n'+"Body:"+bod);
      //  console.log(resp);
        let html = tableify(JSON.parse(bod).teams);
       res.send(html);
      });
      
  });
  
  //Route to obtain data for a Geovisualization in React
  router.get('/stadium-locations',(req,res)=>{
    db2.get().query("Select stadium,city,lat,lang from stadiums;",(err,stadiums)=>{
      if (err) {
        res.status(500).send({Error: err});
      } else {
        res.status(200).send({stadiums});
      }
    })
  });
  //Router to call when you want to update all the coordinates in the Database.
  // Gets Geolocation(Lat, Lang) based on the values in the database
  router.get('/stadium-coordinates',(req,res)=>{
   
      let results = [];
      let html = '';
      let stadiums = [];
      let coordResults = [];

      //Get Stadium Data with response[0].stadium
      db2.get().query("Select * from Stadiums;",(err, response)=>{
        if(err) throw err;
        response.forEach(stadium => {
          console.log(stadium);
          getCoords(stadium.city).then(coords=>{
              db2.get().query("Update Stadiums Set lat = " + coords.lat  +
                              ", lang = " + coords.lng + " where stadium like '%" + stadium.stadium + "%';",(err,response)=>{
                if(err) throw err;
                console.log(response);
              });
          });
        });
      });
      res.status(200).send({Success: "The coordinates have succesfully been retrieved"});
    });
  
    

  
  
  
  //Route to get data for the number a matches played at each stadium
  router.get('/match-stadiums', (req,res)=> {

    db2.get().query("Select   m.stadium 'Stadium' , count(m.stadium) 'Total Matches Held' " +
                    "from matches m, stadiums s " +
                    "where m.stadium = s.stadium " +
                    "group by m.stadium;",(err,results) => {
                      if(err) throw err;
                     res.send(results);
                    });
  });

  router.get('/match-type-totals',(req,res)=>{
    db2.get().query("select type 'Type of Match', count(type) 'Number of Matches'" +
                  "from matches group by type;",(err,results)=>{
                    if(err) throw err;
                    res.send(results);
                  });
  });

  router.get('/total-stadium-capacity',(req,res)=>{
    db2.get().query("Select sum(capacity) 'Total Attendee Capacity' "+
                  "from stadiums;",(err,results)=>{
                    if(err) throw err;
                    res.send(results);
                  });
  });
 //Route to get data for the number a matches played at each round
 router.get('/match-round-totals', (req,res)=> {

  db2.get().query("select round 'Match Round', count(type) 'Number of Matches' "+
                  "from matches group by round;",(err,results) => {
                    if(err) throw err;
                   res.send(results);
                  });
  });

function logInfo(info){
    console.log(info);
}
  
module.exports = router;