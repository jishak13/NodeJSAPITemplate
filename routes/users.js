// Declarations and Initializations
let express = require('express');
let router = express.Router();
let queryExecutor    = require('../modules/queryexecutor');
let todoList = require('../todos.js');
let sql = undefined;

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
    sql = "Select * from gwc.users where fname like '%" + req.params.searchKeyword  + "%';";
    queryExecutor(sql,res);
});

module.exports = router;
