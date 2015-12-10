//NPM requirements
var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

//Server side globals
var isDBConnected = false;
var connection;

//Express setup
app.set('port', process.env.PORT || 8085);
app.use(express['static'](path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

//Connection to the mySQL DB
function connectToDB(callback){

    connection = mysql.createConnection({
        host     : 'host_name',
        user     : 'user_name',
        password : 'pw',
        database : 'db_name'
    });
    //Test it out, if we can connect, great, if not we can only track metrics from the session
    connection.connect(function(err){
        if(err){
            console.log(err.stack);
            callback("none");
        }
        else{
            isDBConnected = true;
            var lastPlayed = fetchLatestRecord(function(data){
                callback(data);
            });
         
        }
    });
}

function fetchLatestRecord(callback){
    connection.query('SELECT * FROM gamesPlayed ORDER BY id DESC LIMIT 1', function(err, rows, fields) {
        if (err) throw err;
        else{
            callback(rows[0]);
        }
    });
}

function fetchTallyTable(callback){
    connection.query('SELECT * FROM tally WHERE Id=1', function(err, rows, fields) {
        if (err) throw err;
        else{
            callback(rows[0]);
        }
    });
}

function inputGameData(data,callback){
    connection.query('INSERT INTO gamesPlayed SET USER_PICK=?,AI_PICK=?,AI_TYPE=?,OUTCOME=?,WRITE_TIME=?',[data.userPick,data.aiPick,data.AIType,data.userOutcome,data.date], function(err,res){
        if(err) {
            console.log("Error writing to DB: "+err);
            callback(false);
        }
        else{
            updateTally(data.userPick,function(){
                callback(true);
            });
        }
    });
}

function updateTally(data,callback){
    var queryString = "";
    switch(data){
        case "rock":
        queryString = 'UPDATE tally SET ROCK = ROCK + 1 WHERE Id = 1';
        break;
        case "paper":
        queryString = 'UPDATE tally SET PAPER = PAPER + 1 WHERE Id = 1';
        break;
        case "scissors":
        queryString = 'UPDATE tally SET SCISSORS = SCISSORS + 1 WHERE Id = 1' 
        break;
    }
    connection.query(queryString, function(err,res){
        if(err) {console.log("Error writing to DB: "+err);}
    });
}

//On document ready, check DB connectivity
app.get('/documentReady',function(req,res){
    connectToDB(function(lastEntry){
        res.send({"dbConnection":isDBConnected,"lastPlay":lastEntry});
    });
});

//When a game ends, write the results to the db tables
app.post('/finishedGame',function(req,res){
    inputGameData(req.body,function(isSucess){
        res.send(isSucess);
    });
});

//When weighted random is assigned as the AI, fetch the tally table
app.get('/fetchTallyTable',function(req,res){
    fetchTallyTable(function(values){
        res.send(values);
    });
});

