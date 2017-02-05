var express = require('express');
var app = express();
var path = require('path');

// Custom JS
require('./dist/actions.js');

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

console.log('Hello world!');
