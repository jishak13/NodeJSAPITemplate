// Declarations and Initializations
let express = require('express');
let router = express.Router();
let conQuery = require('../modules/postReviews');
let queryExecutor = require('../modules/queryexecutor');
// let peerReviewExecutor = require('../modules/peerreviewexecutor');
// let reviewExecutor = require('../modules/reviewexecutor');

let todoList = require('../todos.js');
let sql = [];


//Router usage: Log to the console time any http protocol gets used ( Get, Put , Post Delete )
router.use( (req,res,next) => {
  console.log('Time: ' , Date.now());
    next();
});

//Get the default route infosol/todos
// router.get('/:searchKeyword/', (req,res,next) => {
//     sql = "Select * from ipeer."+ req.params.searchKeyword + ";";
//     queryExecutor(sql,res);
// });

router.post('/peerreview', (req,res,next) => {
    let userReviewing = req.body.ReviewingUser;
    let userBeingReviewed = req.body.UserBeingReviewed;
  
    let peerReviewInsertSQL = "Call AddPeerReview('" +
                                userReviewing + "', '" +
                                userBeingReviewed + "');";
  
   let results =  queryExecutor(peerReviewInsertSQL,res);
    // console.log("The Results from the DB are: ");
    // console.log(results);
    // reviews.forEach((review)=>{
    //     let sql = "Insert into"
    // });
    // Convert to SQL Statement
    // Execute the Query
    // Send a Response
    
});
router.get('/peerreview/:Reviewer/:Reviewee',(req,res,next)=>{
    // console.log(req.params.Reviewer)
    let peerReviewSelectSql =   "Select pr.id" + 
    " from peerreview pr, users reviewers , users reviewee" +
    " where pr.reviewinguserid = reviewers.id" +
    " And pr.USERUNDERREVIEW = reviewee.id" +
    " and pr.reviewingUserID in (select u.id from users u where u.fname like'%" + req.params.Reviewer+ "%')" +
    " and pr.USERUNDERREVIEW in (select u.id from users u where u.fname like '%" + req.params.Reviewee+ "%')" +
    " order by pr.dateOfReview desc " +
    " limit 1;";
    queryExecutor(peerReviewSelectSql,res);
});
router.post('/review/:prid',(req,res,next)=>{
    // console.log('Request Body');
    // console.log(req.body.Reviews);
    let prId = req.params.prid;
    let reviews =  req.body.Reviews;
    let statements = [];
    console.log(prId);
    console.log(reviews);
    // if(reviews!=undefined){
    //     reviews.forEach((review)=>{
    //         let statement = "Insert into Ipeer.Reviews(peerreviewid,questionid,answer) Values ("+
    //                         prId + "," + review.QuestionID + ",'"+
    //                         review.Answer + "');"
    //                         console.log(statement);
    //    statements.push(statement);
    //     });
    //     conQuery(statements,res);
    // }
   res.send("hey");
});
router.get('/questions/', (req,res,next) => {
    sql = "select * from ipeer.questions;";
    queryExecutor(sql,res);
});

router.get('/results/',(req,res,next) => {
    res.send('Will be added soon! Stay Tuned!');
});

module.exports = router;
