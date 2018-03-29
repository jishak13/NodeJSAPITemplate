var express = require('express');
var router = express.Router();
// var competences = require('../competences');
var queryExecutor    = require('../modules/queryexecutor');
var todoList = require('../todos.js');
router.use( (req,res,next) => {
  console.log('Time: ' , Date.now());
    next();
});
router.get('/', (req,res,next) => {
    queryExecutor("Select * from Infosol.Todos;",res);
    // console.log(todoList);
    // res.send(todoList);
})
router.post('/', (req,res,next) => {
    console.log(req.body.ID);
    console.log(req.body.Description);
    todoList.push(req.body);
    res.send(todoList);
});

/* GET users listing. */
router.get('/:searchKeyword', function(req, res, next) {
    console.log('Searching' + req.param.searchKeyword);
//   var searchkeyword = req.params.searchKeyword;
//   console.log(searchkeyword);
//       console.log("Request to search for " + searchkeyword);
//       queryExecutor("Select * From GWC.competences" +     
//                    " where categoryid like '%"  + searchkeyword + "%';",res)
//       if(!text || text===""){
//           res.status(500).send("Error: Could not find these competences");
//       }   else {
//           result = queryExecutor("Select * from GWC.")
//       }
   
});

module.exports = router;
