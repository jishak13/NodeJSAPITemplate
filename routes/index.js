var express = require('express');
var router = express.Router();
var queryExecutor    = require('../modules/queryexecutor');

router.use(function TL (req,res,next) {
    console.log('Time accessed: ' , Date.now());
    next();
});

/* GET index listing. */
router.get('/', function(req, res, next) {
  res.send("<p style='color: red;'> Hi </p>");
});

module.exports = router;
