(function () {
    'use strict';

    // Node Packages
    var _ = require('lodash'),
    request = require('request-promise'),
    promise = require('bluebird'),
    similarity = require('string-similarity');

    var apiKey = '616201ffa86a4fbca11abf770b9e1286',
        apiUrl = 'https://newsapi.org/v1/articles?sortBy=top&apiKey=' + apiKey,
        primarySources = {
            us: 'the-washington-post'
        }, newsSources = {
            us: ['associated-press', 'cnn', 'usa-today', 'the-washington-post', 'bloomberg', 'newsweek', 'reuters', 'the-huffington-post', 'the-new-york-times', 'google-news', 'the-wall-street-journal', 'fortune']
        }, topStories = {}, sortNews, get;

    // TODO: Remove this
    apiKey = '3e22f2fcc1344975ae2b2e69379e2a6e';
    sortNews = function (newsResponses) {
        var primary = newsResponses.shift(),
            secondary = [];

        _.each(newsResponses, function (response) {
            // Loop through newsResponses for "related" news
            var _source = response.source;

            _.each (response.articles, function (article) {
                // Add source to every article
                article.source = _source;
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

                        if (totalMatch > 0.81) {
                            console.log(acticleSec.source);
                            console.log(acticleSec.title);
                            console.log(acticleSec.description);
                            articlePri.related.push(acticleSec);
                        }
                    }
                });
            }
        });
        _.sortBy(primary.articles, function(article) {
            return (_.get(article, 'related')) ? article.related.length : 0;
        });
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

    module.exports = {
        requestData: function (country) {
            var sources = _.get(newsSources, country, []),
            requestUrls = [];

            console.log(_.get(topStories, country, 'YEAH!!!'));
            if (_.get(topStories, country)) {
                // data already exists. return it.
                return topStories[country];
            } else {
                _.each(sources, function (source) {
                    var requestUrl = apiUrl + '&source=' + source;

                    requestUrls.push(get(requestUrl));
                });

                return promise.some(requestUrls, 6).then(function (response) {
                    var sortedNews = sortNews(response);

                    topStories[country] = sortedNews;
                    return sortedNews;
                });
            }
        }
    };
})();
