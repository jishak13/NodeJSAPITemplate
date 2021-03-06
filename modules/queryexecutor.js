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
        throw err;
    }
    // Tell the user console that the database connection has been established
       //Un-comment to see the results on your terminal/prompt
    // console.log("Connected to the Database GWC");

});
//function to execute the query with the database
function executeQuery(sql,res) {
        
    //Execute the query function 
    /** Supplies the sql , and a callback function once the connection executes the query
     * Once executed, errors will be thrown while results will be used for the response back.
     */
    con.query("Use IPEER;",(err,results) => {
        if(err) res.send({"Error":"Error Using Database"});
        
    });
   
    con.query(sql,(err,results) => {
        if(err)  res.send({"Error":"Error Executing  Database Query"});
        else {
            res.send(results);
        }
    });

}
module.exports = executeQuery;