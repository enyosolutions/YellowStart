'use strict';

/**
 * @ngdoc overview
 * @name startApp
 * @description
 * # startApp
 *
 * Main module of the application.
 */
angular
    .module('startApp').config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/js/angular/views/startup/home.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/startup/new', {
            templateUrl: '/js/angular/views/startup/edit.html',
            controller: 'EditStartupCtrl'
        })
        .when('/startup/:_id/edit', {
            templateUrl: '/js/angular/views/startup/edit.html',
            controller: 'EditStartupCtrl'
        })
        .when('/startup/:_id/view', {
            templateUrl: '/js/angular/views/startup/view.html',
            controller: 'ViewStartupCtrl'
        })
        .when('/startup', {
            templateUrl: '/js/angular/views/startup/list.html',
            controller: 'ListStartupCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});