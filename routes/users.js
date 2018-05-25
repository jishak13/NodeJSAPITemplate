// Declarations and Initializations
let express = require('express');
let router = express.Router();
let queryExecutor    = require('../modules/queryexecutor');
let todoList = require('../todos.js');
let sql = undefined;
let lodash = require('lodash');
let config = require('../config');
let jwt = require('jsonwebtoken');
let db2 = require('../db2');


function createToken(user) {
    return jwt.sign(lodash.omit(user, 'password'), config.secretKey, { expiresIn: 60*60*5 });
}

function getUserDB(username, done) {
    db2.get().query('SELECT * FROM Ipeer.users WHERE username = ? LIMIT 1', [username], function(err, rows, fields) {
      if (err) throw err;
      done(rows[0]);
    });
}

router.post('/create', function(req, res) {  
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("You must send the username and the password");
    }
    getUserDB(req.body.username, function(user){
      if(!user) {
        user = {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email
        };
        db2.get().query('INSERT INTO Ipeer.users SET ?', [user], function(err, result){
          if (err) throw err;
          newUser = {
            id: result.insertId,
            username: user.username,
            password: user.password,
            email: user.email
          };
          res.status(201).send({
            id_token: createToken(newUser)
          });
        });
      }
      else res.status(400).send("A user with that username already exists");
    });
});

router.post('/login', function(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send("You must send the username and the password");
    }
    getUserDB(req.body.username, function(user){
      if (!user) {
        return res.status(401).send("The username is not existing");
      }
      if (user.hashPassword !== req.body.password) {
        return res.status(401).send("The username or password don't match");
      }
      res.status(201).send({
        id_token: createToken(user),
        user: user
      });
    });
  });

router.get('/user/check/:username', function(req, res) {
    if (!req.params.username) {
      return res.status(400).send("You must send a username");
    }
    getUserDB(req.params.username, function(user){
      if(!user) res.status(201).send({username: "OK"});
      else res.status(400).send("A user with that username already exists");
    });
  });
  
//Router usage: Log to the console time any http protocol gets used ( Get, Put , Post Delete )
router.use( (req,res,next) => {
  console.log('Time: ' , Date.now());
    next();
});

//Get the default route infosol/todos
router.get('/', (req,res,next) => {
    sql = "Select * from gwc.users";
    queryExecutor(sql,res);
});

// Post a todo to the default route infosol/todos
// This uses the body of the request.
router.post('/register', (req,res,next) => {
    console.log("I am made it here");
    let sqlParams = { 
        fName: req.body.FirstName,
        lName: req.body.LastName,
        gender: req.body.Gender,
        qualification: req.body.Qualification,
        jobTitle: req.body.JobTitle,
        jobLevelID: req.body.JobLevelID,
        employer: req.body.Employer,
        placeOfWork: req.body.PlaceOfWork,
        descriptionOfDuties: req.DescriptionOfDuties,
        userName: req.body.UserName,
        userPassword: req.body.UserPassword,
        dob: req.body.Dob,
        managerID: req.body.ManagerID,
        type: req.body.Type
    };
    console.log(sqlParams);
     sql = "Insert Into GWC.Users Values(" +
           "'"+fName+"','"+lName+"',"+"'"+gender+"','"+
           qualification+"',"+"'"+jobTitle+"',"+jobLevelID+","+
           "'"+employer+"','"+placeOfWork+"');";
    // queryExecutor(sql,res);
    res.send('Check the console');
  
});

//Get a list of todos matching the keyword
router.get('/:searchKeyword', (req, res, next) => {
    
    console.log('Searching' + req.params.searchKeyword);
    
    if(req.params.searchKeyword = undefined) req.params.searchKeyword = '*'
    sql = "Select * from ipeer.users where fname like '%" + req.params.searchKeyword  + "%';";
    queryExecutor(sql,res);
});

module.exports = router;
