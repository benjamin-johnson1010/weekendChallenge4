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
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }//end if
    else{
      var resultsArray = [];
      //set to show incomplete at top and complete at bottom
      var query = client.query('SELECT * FROM task ORDER BY status DESC');
      query.on('row', function(row){
        resultsArray.push(row);
      });//end query on row
      query.on('end',function(){
        done();
        return res.send(resultsArray);
    });
  }
});
});
app.post('/complete', urlencodedParser, function(req, res){
  console.log('complete hit');
  var data ={
    status: req.body.status,
    id: req.body.id
  };
  pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log(data.status);
      //update task to complete
      client.query('UPDATE task SET status=($1) WHERE id=($2)',[data.status, data.id]);
       var query = client.query('SELECT * FROM task ORDER BY status DESC');
       console.log(query);
      var resultsArray = [];
      query.on('row', function(row){
        resultsArray.push(row);
      });
      query.on('end', function(){
        done();
        return res.send(resultsArray);
      });
    }
});
});
app.post('/delete', urlencodedParser, function(req, res){
  console.log('delete hit');
  var data ={
    id: req.body.id
  };
    pg.connect(connectionString, function(err, client, done){
    if(err){
      console.log(err);
    }//end if
    else{
      console.log(data.id);
      //update task to complete
      client.query('DELETE FROM task WHERE id=$1',[data.id]);
       var query = client.query('SELECT * FROM task ORDER BY status DESC');
       console.log(query);
      var resultsArray = [];
      query.on('row', function(row){
        resultsArray.push(row);
      });
      query.on('end', function(){
        done();
        return res.send(resultsArray);
      });
    }
});
});
app.use(express.static('public'));
