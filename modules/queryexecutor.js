var mysql             = require('mysql'),
connString        = require('../modules/db'),
queryResults,sql,
con               = mysql.createConnection(connString),
databaseConnected = false;

//function to execute the query with the database
function executeQuery(sql,res) {
    var result = "";

    //If the API is not already connected
    if(!databaseConnected){
        // Try connecting to the database
       con.connect(function(err) {
        //If there is an error connecting to the database
        if (err) {
            //Log the Error
            console.log('Connection To The Database Failed Error:' + err)
            databaseConnected = false;
            result =  { "result":"Connection to the database failed" };
        } else {

            databaseConnected = true;
            //Log Connected to the Database
            console.log("Connected to the Database GWC");
            //Set the SQL Statement for the Index Route
            //    res.status(200).send(res)
                con.query(sql, function( err, results, fields ){

                    if(err) {
                        console.log("The Error is Here " + err);
                        res.status(500).send("There was an error in query execution.");
                
                    } else {
                       console.log(results);
                 
                        res.status(200).send( results);
                    }
                });
            
            }
        });
  
   }
  

}
module.exports = executeQuery;