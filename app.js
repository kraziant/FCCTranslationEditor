var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var exec = require('child_process').exec;


var config = {
  "port": 3000,
  "target": "/home/anton/work/FCC-Russian-Translation/basic-html5-and-css.json"
};

app.use(bodyParser.json({limit: '5mb'}));
//app.use(bodyParser.urlencoded({limit: '5mb', extended:true}));

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/speller', express.static(__dirname + '/speller'));

app.get('/', function (req, res) {
  fs.readFile('index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    res.send( data );
  });
});

app.get('/get_data', function (req, res) {
  fs.readFile(config.target, 'utf8', function (err, data) {
    console.log('data request');
    if (err) {
      res.send( err );
      return console.log(err);
    }
    res.send( data );
  });
});

app.post('/post_data', function(req, res) {
    console.log('ok');
    fs.writeFile('tmp.txt', JSON.stringify(req.body, null, 2), 'utf-8', function () {
      console.log('data saved');
      exec("patch < difficult.patch", function() {
        console.log('difficult.patch apply to saved file');
        exec("cp tmp.txt " + config.target, function(){});
      });
    });
    res.end();
});

var server = app.listen(config.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});