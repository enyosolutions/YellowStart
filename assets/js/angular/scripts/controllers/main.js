'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
  .controller('MainCtrl', function ($scope, Crawler) {

        $scope.crawlMeta = function (url) {
            if (url && url.length > 0) {
                if(url.indexOf('http://') === -1){
                    url = 'http://' + url;
                }
                var query = Crawler.meta({url:url});
                query.$promise.then(function (meta, er) {
                    console.log(er);
                    console.log(meta);
                });
            }
        };
  });
