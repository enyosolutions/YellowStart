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
        $scope.pageClass = 'list-page';

        var query = {};

        // global search function
        $scope.search = function (q) {
            console.log(q);
            console.log($state.current);
            console.log($scope.searchedStartups);
            $state.go('startup-list', {search: q});
            return;
            if(!$state.is('startup-list')){
                $state.go('startup-list', {search: q});
            }
            else if (q && q.length > 0) {
                $scope.searchedStartups = Startup.query({search: q});
                console.log($scope.searchedStartups);
            }
        };


        $scope.deleteStartup = function (id) {
            var c = $scope.startupList.splice(id,1);
            console.log(c);
            Startup.delete({_id: c[0]._id});

        };


        if($routeParams.tag){
            query = {tag: $routeParams.tag};
        }
        else {
            if($routeParams.search){
                query = {tag: $routeParams.tag};
            }
        }

        if($stateParams.search){
            console.log($stateParams.search);
            $scope.searchedStartups = Startup.query({search: $stateParams.search});
        }

        query['sort[createdAt]'] = 1;
        $scope.recentStartupList = Startup.query(query);
        console.log($scope.recentStartupList);

        delete query['sort[createdAt]'];
        query['sort[tags]'] = 1;
        $scope.trendingStartupList = Startup.query(query);
    });
