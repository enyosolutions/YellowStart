'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('ListStartupCtrl', function ($scope, $state, $stateParams, $routeParams, Startup) {
        $scope.pageClass = 'startup-list';

        var query = {};

        // global search function
        $scope.search = function (q) {
            console.log(q);
            console.log($state.current);
            console.log($scope.searchedStartups);
            $state.go('startup-list', {search: q});
            return;
        };


        $scope.deleteStartup = function (id) {
            var c = $scope.startupList.splice(id, 1);
            console.log(c);
            Startup.delete({_id: c[0]._id});

        };


        $scope.sortByName = function () {
           $scope.searchedStartups = Startup.query(angular.extend({ 'sort[startupName]': 1}, query));
        };

        $scope.sortByViews = function () {
           $scope.searchedStartups = Startup.query(angular.extend({'sort[meta.views]': -1}, query));
        };
        $scope.sortByCreatedDate = function () {
          $scope.searchedStartups = Startup.query(angular.extend({'sort[createdAt]': -1}, query));
        };

        $scope.sortByBookmarks = function () {
           $scope.searchedStartups = Startup.query(angular.extend({ 'sort[meta.bookmarks]': -1}, query));
        };


        if ($stateParams.tag) {
            $scope.searchTitle  = '#' + $stateParams.tag;
            query.tag  =  $stateParams.tag;
            $scope.searchedStartups = Startup.query(query);
        }

        if ($stateParams.search) {
            $scope.searchTitle  = $stateParams.search;
            query.search  =  $stateParams.search;
            $scope.searchedStartups = Startup.query(query);
        }

        $scope.recentStartupList = Startup.query({'sort[createdAt]':1});
        console.log($scope.recentStartupList);

        $scope.trendingStartupList = Startup.query({'sort[tags]':1});
    })

    .directive('homeSlider', function () {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                var config = angular.extend({
                    slides: '.slide',
                    pager: '> .cycle-pager'
                }, scope.$eval(attrs.homeSlideshow));
                setTimeout(function () {
                    element.cycle(config);
                }, 0);
            }
        };
    })
;
