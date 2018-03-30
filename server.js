// Declarations and Initializations
let express           = require('express');
let app               = express();
let http              = require('http');
let server            = http.createServer(app);
let bodyParser        = require('body-parser');
let phonegap          = require('connect-phonegap');

let todos             = require('./routes/todos');
let index             = require('./routes/index');

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
// Root route is /infosol
app.use('/infosol/todos',todos);

app.use('/infosol/gwc/cat',index);

