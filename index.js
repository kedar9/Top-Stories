var express = require('express');
var _ = require('lodash');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;

// Custom JS
var actions = require('./dist/actions.js');
console.log('apiUrl:: ', actions);

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/news', function(req, res, next) {
		var country = _.get(req, 'query.country', actions.defaultCountry);

		if (_.get(actions.topStories, country)) {
				// Data already exists. Return it.
				res.json(_.get(actions.topStories, country));
		} else {
				actions.requestData(country)
				.then(function (result) {
		        res.json(result);
		    });
		}
});

app.listen(port, function () {
    console.log('App listening on port ' + port);
});
