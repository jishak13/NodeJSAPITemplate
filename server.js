// Declarations and Initializations
let express           = require('express');
let app               = express();
let https             = require('http');
let db2               = require('./db2').connect();
let server            = https.createServer(app);
let bodyParser        = require('body-parser');
let phonegap          = require('connect-phonegap');

let index             = require('./routes/index');
let users             = require('./routes/users');
let custom            = require('./CustomElementsGoogleCharts');
let d3                = require('./routes/d3');
let worldcup          = require('./routes/worldcup');
let footballapi       = require('./routes/footballapi.js');

//Use Body Parser when reading data from a request
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended:false}));

//Tell the server where to listen 
server.listen(80, () =>{
    console.log("Hello There listening on port 80 ");
});

// Setting the headers for all routes to be CORS compliant
app.use(function(req,res,next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

/**Setting the Routes */
// Root route is /infosol
// app.use('/infosol/todos',todos);
// app.use('/infosol/training/pdstats',shootings);
// app.use('/infosol/gwc/competences',competences);

app.use('/infosol/users',users);
app.use('/',custom);
app.use('/d3',d3);
app.use('/api/worldcup',worldcup);
app.use('/api/football',footballapi);
// app.use('/infosol/gwc/assessments',assessments);

