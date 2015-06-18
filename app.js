var fs = require('fs');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  fs.readFile('index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    res.send( data );
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});