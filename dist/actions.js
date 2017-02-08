(function () {
  'use strict';

  // Node Packages
  var _ = require('lodash'),
    request = require('request');

  var apiKey = '616201ffa86a4fbca11abf770b9e1286',
    apiUrl = 'https://newsapi.org/v1/articles?sortBy=top&apiKey=' + apiKey,
    primarySources = {
      us: 'the-washington-post'
    }, newsSources = {
      us: ['the-washington-post', 'cnn']
    }, primaryResponse = {},
    newsResponses = {};

    module.exports = {
      requestData: function (country) {
        var sources = _.get(newsSources, country, []),
          requestOptions = {
            timeout: 3000,
            json: true,
          };

        if (_.get(primaryResponse, country)) {
          // data already exists. return it.
        } else {
          newsResponses[country] = [];
          _.each(sources, function (source) {
            var requestUrl = apiUrl + '&source=' + source;

            requestOptions.url = requestUrl;
            request.get(requestOptions, function(error, response, data) {
              if (!error && response.statusCode === 200) {
                if (source === primarySources[country]) {
                  primaryResponse[country] = data.articles;
                } else {
                  console.log('here ');
                  _.each(data.articles, function (article) {
                    newsResponses[country].push(_.pick(article, ['title', 'description', 'url']));
                  });
                }
                return newsResponses[country];
              }
            });
          });
        }
      }
    };
})();
