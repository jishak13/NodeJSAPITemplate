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
router.get('/:searchKeyword/', (req,res,next) => {
    sql = "Select * from ipeer."+ req.params.searchKeyword + ";";
    queryExecutor(sql,res);
});
router.get('/questions/'), (req,res,next) => {
    sql = "select * from ipeer.question;";
    queryExecutor(sql,res);
}

router.get('/results/'),(req,res,next) => {
    res.send('Will be added soon! Stay Tuned!');
}
module.exports = router;
