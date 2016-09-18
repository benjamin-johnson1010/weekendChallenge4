var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require('pg');
var connectionString = 'postgress://localhost:5432/tasks';
var urlencodedParser = bodyParser.urlencoded( {extended: false } );
var port = process.env.PORT || 3000;


app.listen(port, function(){
  console.log('server listening on port', port);
});
//serve home page
app.get('/', function(req, res){
  console.log('Base URL hit');
  res.sendFile(path.resolve('public'));
});
//receive object from client
app.route('/newTask')
//add task
.post(urlencodedParser, function(req, res){
  console.log('newTask route hit', req.body);
  //connect to database
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log('connected to db');
      console.log(req.body.status);
      var resultsArray = [];
      var query = client.query('INSERT INTO task (task, status) VALUES ($1, $2) RETURNING *;', [req.body.task, req.body.status]);
      query.on('row', function(row){
        resultsArray.push(row);
      });//end query on row
      query.on('end',function(){
        done();
        console.log(resultsArray);
        return res.json(resultsArray);
      });//end query on end
    }//end else
  });//end pg
});//end /newTask
app.get('/newTask', urlencodedParser, function(req, res){
  console.log('/newTask get hit');
});
app.use(express.static('public'));
