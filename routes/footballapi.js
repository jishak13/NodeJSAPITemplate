let express         = require('express');
let router          = express.Router();
let request         = require('request');
let tableify         = require('tableify');

router.use( (req,res,next) => {
    console.log('Time: ' , Date.now()); 
    next();
  });

  router.get('/matches',(req,res)=>{
      request('http://api.football-api.com/2.0/matches?comp_id=1204&Authorization=565ec012251f932ea4000001fa542ae9d994470e73fdb314a8a56d76',(err,results)=>{
          console.log(results)
      })
  })

module.exports = router;