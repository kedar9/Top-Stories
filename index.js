var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;

// Custom JS
require('./dist/actions.js');

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function () {
  console.log('App listening on port ' + port);
});
