// Declarations and Initializations
let mysql             = require('mysql');
let connString        = require('../modules/db');
let queryResults      = undefined;
let con               = mysql.createConnection(connString);
let databaseConnected = false;
let sql = [];


 // Try connecting to the database
 con.connect((err) => {
    //  Throw the Error
    if(err) {
       
    }
    // Tell the user console that the database connection has been established
       //Un-comment to see the results on your terminal/prompt
    // console.log("Connected to the Database GWC");

});

function conQuery(sql,res) {
        
    //Execute the query function 
    /** Supplies the sql , and a callback function once the connection executes the query
     * Once executed, errors will be thrown while results will be used for the response back.
     */
    con.query("Use IPEER;",(err,results) => {
        if(err) res.send({"Error":"Error Using Database"});
        
    });
    let i  = 0;
    let success = true;
    sql.forEach(statement => {
    con.query(statement,(err,results) => {
        if(err)  sucess = false;
        else {
          
        }
    });
    
   });
  let response = (success ==true ? "Sucess" : "Failure");
    res.send(response);
}

module.exports = conQuery;