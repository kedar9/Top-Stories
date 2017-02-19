(function () {
  'use strict';

  // Node Packages
  var _ = require('lodash'),
  request = require('request-promise'),
  promise = require('bluebird'),
  similarity = require('string-similarity');

  var exports = module.exports,
  apiKey = '616201ffa86a4fbca11abf770b9e1286',
  apiUrl = 'https://newsapi.org/v1/articles?sortBy=top&apiKey=' + apiKey,
  newsSources = {
    us: ['associated-press', 'cnn', 'usa-today', 'the-washington-post', 'bloomberg', 'newsweek', 'reuters', 'the-huffington-post', 'the-new-york-times', 'google-news', 'the-wall-street-journal', 'fortune'],
    gb: ['sky-news', 'bbc-news', 'the-guardian-uk', 'the-telegraph', 'independent', 'daily-mail'],
    in: ['the-hindu', 'the-times-of-india'],
    de: ['der-tagesspiegel', 'focus', 'die-zeit', 'spiegel-online', 'bild'],
    au: ['abc-news-au', 'the-guardian-au']
  }, sortNews, get;

  // TODO: Remove this
  apiKey = '3e22f2fcc1344975ae2b2e69379e2a6e';
  sortNews = function (newsResponses) {
    var minMatch = (newsResponses.length / (newsResponses.length + 2)),
    primary = newsResponses.shift(),
    secondary = [];

    console.log('minMatch: ', minMatch);

    _.each(newsResponses, function (response) {
      // Loop through newsResponses for "related" news
      var _source = response.source;

      _.each (response.articles, function (article) {
        // Add source to every article
        article.source = _.startCase(_source);
        // `secondary` becomes an array of articles from all news sources
        // except the first one that became the `primary`.
        secondary.push(article);
      });
    });

    console.log('SOURCE: ', primary.source);
    _.each(primary.articles, function (articlePri) {
      console.log('\n\nPRIMARY: ');
      console.log(articlePri.title);
      console.log(articlePri.description);
      console.log('\nRELATED: ');

      if (!_.isEmpty(articlePri.title) && !_.isEmpty(articlePri.description)) {
        articlePri.related = [];
        _.each(secondary, function (acticleSec) {
          if (!_.isEmpty(acticleSec.title) && !_.isEmpty(acticleSec.description)) {
            var titleMatch = similarity.compareTwoStrings(articlePri.title, acticleSec.title),
            descMatch = similarity.compareTwoStrings(articlePri.description, acticleSec.description),
            totalMatch = titleMatch + descMatch;

            if (totalMatch > 0.75) {
              console.log(acticleSec.source);
              console.log(acticleSec.title);
              console.log(acticleSec.description);
              articlePri.related.push(acticleSec);
            }
          }
        });
      }
    });
    // Sort articles by number of related articles - descending 
    primary.articles.sort(function(a, b) {
        return b.related.length - a.related.length;
    });
    console.log(primary);
    return primary;
  };

  get = function (requestUrl) {
    var requestOptions = {
      uri: requestUrl,
      timeout: 3000,
      json: true,
    };

    return request(requestOptions);
  };

  // Exports
  exports.topStories = {};
  exports.defaultCountry = 'us';
  exports.requestData = function (country) {
    var requestUrls = [], sources, minSources;

    if (_.keys(newsSources).indexOf(country) === -1) {
      country = exports.defaultCountry;
    }

    sources = _.get(newsSources, country, []);
    minSources = Math.ceil(sources.length / 2);

    _.each(sources, function (source) {
      var requestUrl = apiUrl + '&source=' + source;

      requestUrls.push(get(requestUrl));
    });

    return promise.some(requestUrls, minSources).then(function (response) {
      var sortedNews = sortNews(response);

      // URL params could have an incorrect country code.
      // Add code for the country to the news data.
      sortedNews.country = country;
      exports.topStories[country] = sortedNews;
      return sortedNews;
    });
  };
})();
