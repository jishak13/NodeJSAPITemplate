

//Create variables for Node.JS Server Implementation
let express           = require('express');
let http              = require('http');
let app               = express();
let server            = http.createServer(app);
let bodyParser        = require('body-parser');
let phonegap          = require('connect-phonegap');

var index             = require('./routes/index');
// var competence        = require('./routes/competences');
// var competenceSearch  = require('./routes/competenceSearch');
//Create variables for MySql Database Implementation
let mysql             = require('mysql');
let connString        = require('./modules/db');
let queryResults      = "";
let sql               = "";
let con               = mysql.createConnection(connString);
let databaseConnected = false;
let todos             = require('./routes/todos');
    // Competency        = require('./Models/competences');

//Use Body Parser when reading data from a request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//Tell the server where to listen 
server.listen(80, () =>{
    console.log("Hello There");
});

// Setting the headers for all routes to be CORS compliant
app.use(function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    next();
});

/**Setting the Routes */
app.use('/todos',todos);
app.use('/',index);

