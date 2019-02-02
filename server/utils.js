(() => {
  'use strict';

  const NewsAPI = require('newsapi');
  const newsapi = new NewsAPI('616201ffa86a4fbca11abf770b9e1286');
  const stringSimilarity = require('string-similarity');
  const constants = require('./../constants.js');
  const data = require('./data.js');
  const exports = {};

  let savedSources = {};
  const mockData = false;
  const displayLogs = false;

  const getSources = (country, category) => {
    if (mockData) {
      return new Promise(function(resolve, reject) {
         resolve([]);
      });
    }

    const countrySources = savedSources[country];
    if (countrySources && countrySources.length) {
      const filteredSources = countrySources
        .filter(source => source.category === category)
        .map(source => source.id);

      return new Promise(function(resolve, reject) {
        resolve(filteredSources);
      });
    }
    const requestObj = { country };
    if (displayLogs) console.log('getting sources for: ', requestObj);

    return newsapi.v2.sources(requestObj).then(response => {
      const { sources } = response;
      if (sources) {
        let googleNewsSource;

        savedSources[country] = [ ...sources ];
        // Set `filteredSources` as an array of available source ids.
        const filteredSources = sources.filter(source => {
          if (source.category === category) {
            const { id } = source;
            if (id.startsWith(constants.GOOGLE_NEWS)) {
              googleNewsSource = source.id;
            }

            // Filter out `GOOGLE_NEWS` (to unshift it down below).
            return !id.startsWith(constants.GOOGLE_NEWS);
          }

          // Do not return sources that do not belong to current category
          return false;
          }).map(source => source.id);

        if (googleNewsSource) {
          // Add `GOOGLE_NEWS` to the beginning of the array
          // to let the `getData` method know there's google news available
          filteredSources.unshift(googleNewsSource);
        }
        return filteredSources;
      }
      return [];
    }).catch(() => []);
  };

  const getTopHeadlines = (requestObj) => {
    if (mockData) {
      return new Promise(function(resolve, reject) {
         resolve(data.main);
      });
    }
    return newsapi.v2.topHeadlines(requestObj).then(response => {
      if (displayLogs) console.log('getTopHeadlines response: ', response);
      const { articles } = response;
      if (displayLogs) console.log('TOPHEADLINES RESPONSE RECEIVED WITH ARTICLES:', articles.length);

      if (articles && Array.isArray(articles)) {
        return articles;
      } else {
        if (displayLogs) console.log('TOPHEADLINES NOT RECEIVED FROM NEWSAPI');
        return [];
      }
    }).catch(() => []);
  };

  const getRelatedArticles = (mainArticle, relatedData) => {
    let related = [];
    const mainStr = `${mainArticle.title || '' }
      ${mainArticle.description || ''}`;
    let i = 0;
    let matchedIndices = [];

    while (related.length <= 6 && i < relatedData.length) {
      const relatedArticle = { ...(relatedData[i] || {})};
      const relatedStr = `${relatedArticle.title || '' }
        ${relatedArticle.description || '' }`;

      const score = stringSimilarity.compareTwoStrings(
        mainStr, relatedStr);

      if (score >= 0.48 && score < 0.9) {
        relatedArticle.score = score;
        related.push(relatedArticle);
        matchedIndices.push(i);
      }
      i++;
    }
    related.sort((a, b) => b.score - a.score);

    if (displayLogs) console.log('related: ', related);
    return related.slice(0, 4);
  };

  const getCompleteData = (mainArticles, relatedArticles) => {
    if (mainArticles.length < 1 || relatedArticles.length < 1) {
      return mainArticles;
    }

    const completeData = mainArticles.map(mainArticle => {
      const related = getRelatedArticles(mainArticle, relatedArticles)
      return {
        ...mainArticle,
        related
      }
    });
    completeData.sort((a, b) => b.related.length - a.related.length);

    return completeData;
  };

  const getData = (country, category, sources = []) => {
    const isGeneral = (category === constants.GENERAL_CATEGORY);
    const hasGoogleNews = sources[0] &&
      sources[0].includes(constants.GOOGLE_NEWS);

    // If `hasGoogleNews` then we make 2 calls: first to get google-news data
    // and second to get data from other sources.
    // If `hasGoogleNews` is false, we make only one call: to get all the headlines.
    const mainReqObj = hasGoogleNews ?
      { sources: sources.shift() } :
      { country, category };
    const relatedReqObj = {
      sources: sources.join(','),
      pageSize: 90
    };

    if (displayLogs) console.log('mainReqObj: ', mainReqObj);

    // Get Main Headlines
    return getTopHeadlines(mainReqObj).then(mainData => {
      if (isGeneral) {
        // Get Related Headlines
        return getTopHeadlines(relatedReqObj).then(relatedData => {
          const completeData = getCompleteData(mainData, relatedData);

          if (displayLogs) console.log('\n\n completeData: ', completeData);
          return {
            country,
            category,
            articles: completeData
          };
        });
      }

      return {
        country,
        category,
        articles: mainData
      };
    });
  };

  exports.search = (q) => {
    const requestObj = {
      q,
      sortBy: 'publishedAt',
      language: 'en'
    };

    return newsapi.v2.everything(requestObj).then(response => {
      const { articles } = response;

      if (articles && Array.isArray(articles)) {
        return { q, articles };
      } else {
        if (displayLogs) console.log('SEARCH NOT RECEIVED FROM NEWSAPI');
        return { q };
      }
    }).catch(() => { q });
  }

  exports.initNews = (country, category) => {
    console.log('STARTING TO GET DATA FOR: ', country, category);
    return getSources(country, category).then(sources => {
      if (displayLogs) console.log('activeSources: ', sources);
      return getData(country, category, sources);
    });
  };

  module.exports = { ...exports };
})();
