(function () {
  'use strict';

  var angular = window.angular || (window.angular = {}),
      newsApp;

  newsApp = angular.module('newsApp', []);

  // Angular factory to get $http data
  newsApp.factory('newsFactory', ['$http', function ($http) {
    return {
      get: function (url) {
        return $http.get(url)
          .then(function (response) {
            return response.data;
          }
        );
      }
    };
  }]);

  newsApp.controller('newsCtrl', ['$scope', 'newsFactory', function ($scope, newsFactory) {
    $scope.countries = [
      {
        code: 'us',
        name: 'USA'
      },
      {
        code: 'gb',
        name: 'UK'
      },
      {
        code: 'in',
        name: 'India'
      },
      {
        code: 'de',
        name: 'Germany'
      },
      {
        code: 'au',
        name: 'Australia'
      }
    ];

    // Get news data on start
    newsFactory.get('/news' + location.search).then(function (data) {
      $scope.country = data.country;
      $scope.topStories = data.articles;
      $scope.mainSource = data.source;
    });

  }]);
})();
