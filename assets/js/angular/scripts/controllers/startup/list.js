'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('ListStartupCtrl', function ($scope, $routeParams, Startup) {
        $scope.pageClass = 'list-page';

        var query = {};
        if($routeParams.tag){
            query = {tag: $routeParams.tag};
        }
        $scope.startupList = Startup.query(query);


        $scope.deleteStartup = function (id) {
            var c = $scope.startupList.splice(id,1);
            console.log(c);
            Startup.delete({_id: c[0]._id});

        }
    });
