// Declarations and Initializations
let express = require('express');
let router = express.Router();
let queryExecutor    = require('../modules/queryexecutor');

router.use( (req,res,next) => {
    console.log('Time accessed: ' , Date.now());
    next();
});

/* GET index listing. */
router.get('/', (req, res, next) => {
  res.send("<p style='color: red;'> Hi </p>");
});

module.exports = router;
