(() => {
  'use strict';

  const fetch = require('node-fetch');
  // Azure setup
  const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
  let credentials = new CognitiveServicesCredentials('9945ae62607644008cda22634db54bdf');
  const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');
  let client = new NewsSearchAPIClient(credentials);

  exports.allOps = () => {
    console.log('NewsSearchAPIClient: ', client.newsOperations.search);
  };

  exports.search = () => {
    client.newsOperations.search('top stories', {
      mkt: 'en-us',
      count: 60,
      freshness: 'Day',
      originalImage: true
    }).then((result) => {
      console.log(result.value);
    }).catch((err) => {
      throw err;
    });
  }

  exports.headlines = () => {
    client.newsOperations.category({
      clientIp: '108.39.38.179',
      count: 60,
      freshness: 'Day',
      originalImage: true
    }).then((result) => {
      console.log('\n DATA FROM BING: /n', result);
    }).catch((err) => {
      throw err;
    });
  };

  module.exports = { ...exports };
})();
