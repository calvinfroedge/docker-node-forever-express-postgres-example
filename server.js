var express = require('express');
var app = express();
var pg = require('pg');

/*
 * Hello, world!
 */
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/*
 * Show environment variables
 */
app.get('/env', function(req, res){
  var s = [];
  for(var key in process.env){
    s.push([key, process.env[key]].join(': '));
  }
  res.send(s.join(", "));
});

/*
 * Connect to db
 */
app.get('/testdb', function(req, res){
  var config = process.env;
  var address = process.env.DB_PORT.split('//')[1];
  var conString = 'postgres://'+config.DB_ENV_DB_USER+':'+config.DB_ENV_DB_PASS+'@'+address;

  pg.connect(conString, function(err, client, done){
    client = client;
    if(err){
      console.error('error fetching client from pool', err);
      res.send('Could not connect to postgres.');
    } else {
      res.send('Connected to postgres!');
    }
  });
});

/*
 * Trigger tests
 */
app.get('/tests', function(req, res){
  var reporter = require('nodeunit').reporters.default;

  var run_tests = ['/app/test.js'];
  reporter.run(run_tests, null, function(){
    res.send('Check logs.'); 
  });
});

/*
 * On server start
 */
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
