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
    sql = "Select * from gwc.competences";
    queryExecutor(sql,res);
});

//Post a todo to the default route infosol/todos
//This uses the body of the request.
// router.post('/', (req,res,next) => {
//     sql = "";
//     queryExecutor(sql,res);
  
// });

//Get a list of todos matching the keyword
router.get('/:searchKeyword', (req, res, next) => {
    console.log('Searching' + req.params.searchKeyword);
    if(req.params.searchKeyword = undefined) req.params.searchKeyword = '*'
    sql = "Select * from gwc.competences where statement like '%" + req.params.searchKeyword  + "%';";
    queryExecutor(sql,res);
});

module.exports = router;
