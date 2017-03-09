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
                });
            }
        };
    }]);

    newsApp.config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|whatsapp):/);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
    ]);

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
            $scope.activeCountry = data.country;
            $scope.topStories = data.articles;
            $scope.apiError = data.error;
            $scope.mainSource = data.source;
        });

    }]);
})();
