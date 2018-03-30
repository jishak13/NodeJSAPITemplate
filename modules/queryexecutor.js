// Declarations and Initializations
let mysql             = require('mysql');
let connString        = require('../modules/db');
let queryResults      = undefined;
let con               = mysql.createConnection(connString);
let databaseConnected = false;


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
    con.query(sql, ( err, results ) => {

        if(err) throw err;
        //Un-comment to see the results on your terminal/prompt
        console.log(results);    
        res.send(results);          
    });
}
module.exports = executeQuery;