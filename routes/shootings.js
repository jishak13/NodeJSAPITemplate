
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
router.get('/pdmodified', (req,res,next) => {
    sql = "Select * from infosol.pdmodified;";
    queryExecutor(sql,res);
});

//Get the default route infosol/todos
router.get('/pdsupplement', (req,res,next) => {
    sql = "Select * from infosol.pdsupplement;";
    queryExecutor(sql,res);
});

module.exports = router;
