'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')

    .controller('TagcloudCtrl', function ($scope,$rootScope, $state, $stateParams, $location, $timeout, $routeParams, Startup, Crawler, CONFIG) {
        $scope.recentStartupList = {};
        $scope.pageClass = 'startup-list';
        $scope.currentPage = 0;
        $scope.remoteHost = CONFIG.baseUrl;
        $scope.q = '';
        var query = {'publishedOnly':1};

        Crawler.tags().$promise.then(function(res){
            res = res.map(function(e){e.link = '#/startup?tag=' + e.text; return e;});
            $scope.tagCloud = res;
        });
    })
;
