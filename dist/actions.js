(function () {
  'use strict';

  var _ = require('lodash'),
    request = require('request');

  var apiKey = '616201ffa86a4fbca11abf770b9e1286',
    apiUrl = 'https://newsapi.org/v1/articles?sortBy=top&apiKey=' + apiKey,
    newsSources = {
      us: ['the-washington-post', 'cnn']
    }, newsResponses = {}, requestData;

  _.each([1, 2, 3, 5], function (i) {
    console.log('value: ', i);
  });

  requestData = function (sources) {
    _.each(sources, function (source) {
      var requestUrl = apiUrl + '&source=' + source;

      request
        .get(requestUrl)
        .on('response', function(response) {
          console.log('Requesting from: ', requestUrl);
          if (response.statusCode === 200) {
            newsResponses[source] = response.data;
            console.log('response.articles: ', response.data);
          }
          // console.log(response.headers['content-type'])
        })
        .on('error', function(err) {
          console.log(err)
        });
    });
  };

  requestData(newsSources.us);

})();
