var express = require('express'),
    _ = require('lodash'),
    app = express(),
    path = require('path'),
    port = process.env.PORT || 3000;

// Custom JS
var actions = require('./actions.js');

// Expose static content from /dist/ on path /static/
app.use('/static', express.static(__dirname + '/dist'));

// Handle 404 and 500
app.use(function(err, req, res, next) {
    res.status(404).send('404: Page not Found');
    res.status(500).send('500: Internal Server Error');
});

app.get('/news', function(req, res, next) {
    var country = _.get(req, 'query.country', actions.defaultCountry),
        preloadedData = _.get(actions.topStories, country),
        today = new Date();

    if (preloadedData && (today.getTime() - preloadedData.updateTime) < 43200000) {
        // Data already exists and was loaded on the server in the last 12 hours.
        res.json(_.get(actions.topStories, country));
    } else {
        actions.requestData(country)
        .then(function (result) {
            res.json(result);
        });
    }
});

// Because AngularJS doesn't load before ExpressJS
// ng scope property throws a 404 error in template.
// For now just this particular path throws the 404 error.
app.get('/%7B%7Bstory.urlToImage%7D%7D', function(req, res) {
    res.send('');
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, function () {
    console.log('App listening on port ' + port);
});
