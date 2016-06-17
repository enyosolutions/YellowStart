'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')

    .controller('ListStartupCtrl', function ($scope, $state, $stateParams, $location, $timeout, $routeParams, Startup) {
        $scope.recentStartupList = {};
        $scope.pageClass = 'startup-list';
        $scope.currentPage = 0;
        $scope.q = '';
        var query = {};

        // global search function
        $scope.search = function (q) {
            console.log('SEARCH', $scope.searchName);
            $state.go('startup-list', {search: $scope.searchName});
            return;
        };

        $scope.searchAutocomplete = function (selection) {
            console.log('AUTOCOMPLETE SELECTED', selection);
            if (selection) {
                if (selection.originalObject.type === 'startup') {
                    $state.go('startup-view', {_id: selection.originalObject.id});
                    $scope.$broadcast('angucomplete-alt:clearInput');
                }
                else {
                    $scope.searchName = selection.title;
                    $scope.search(selection.title);
                }
            }
        };

        $scope.searchAutocompleteCHG = function (q) {
            console.log('AUTOCOMPLETE CHANGED', q);
            $scope.searchName = q;
        };


        $scope.deleteStartup = function (id) {
            var c = $scope.startupList.splice(id, 1);
            console.log(c);
            Startup.delete({_id: c[0]._id});

        };


        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
            $scope.searchedStartups = Startup.query(angular.extend({page: $scope.currentPage}, query));
        };


        $scope.nextPage = function () {
            $scope.currentPage++;
            $scope.searchedStartups = Startup.query(angular.extend({page: $scope.currentPage}, query));
        };

        $scope.sortByName = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[startupName]': 1}, query));
        };

        $scope.sortByViews = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[meta.views]': -1}, query));
        };
        $scope.sortByCreatedDate = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[createdAt]': -1}, query));
        };

        $scope.sortByBookmarks = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[meta.bookmarks]': -1}, query));
        };

        $scope.sortByNoteSip = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[sipScore]': -1}, query));
        };


        if ($stateParams.tag) {
            $scope.searchTitle = '#' + $stateParams.tag;
            query.tag = $stateParams.tag;
            $scope.searchedStartups = Startup.query(query);
        }

        if ($stateParams.search) {
            $scope.searchTitle = $stateParams.search;
            query.search = $stateParams.search;
            $scope.searchedStartups = Startup.query(query);
        }

        $scope.recentStartupList = Startup.query({'sort[createdAt]': -1});
        $scope.mostViewedStartupList = Startup.query({'sort[meta.views]': -1});
        $scope.bestScoreStartupList = Startup.query({'sort[sipScore]': -1});
        $scope.mostBookmarkedStartupList = Startup.query({'sort[meta.bookmarks]': -1});
        $scope.lessViewedStartupList = Startup.query({'sort[meta.views]': -1});
    })

    .directive('homeSlider', function() {
        return function(scope, element) {
            if (scope.$last){
                element.parent().cycle({
                    slides: '.slide',
                    pager: '> .cycle-pager',
                    maxZ: 100
                });
            }
        };
    })

    .directive('startupSlider', function() {
        return function(scope, element) {
            if (scope.$last){
                element.parent().slick({
                    infinite: false,
                    variableWidth: true,
                    speed: 300,
                    centerMode: false,
                    slidesToShow: 4,
                    slidesToScroll: 1
                });
            }
        };
    })
;
