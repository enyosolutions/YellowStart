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
    .module('startApp').config(function ($stateProvider, $urlRouterProvider) {

        function _skipIfAuthenticated($q, $state, $auth) {
            var defer = $q.defer();
            if($auth.authenticate()) {
                defer.reject(); /* (1) */
            } else {
                defer.resolve(); /* (2) */
            }
            return defer.promise;
        };

        function _redirectIfNotAuthenticated($q, $state, $auth) {
            var defer = $q.defer();
            if($auth.authenticate()) {
                defer.resolve(); /* (3) */
            } else {
                $timeout(function () {
                    $state.go('user-login'); /* (4) */
                });
                defer.reject();
            }
            return defer.promise;
        };


        $urlRouterProvider.otherwise('/user/register');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/js/angular/modules/startup/list/home.html',
                controller: 'ListStartupCtrl',
                resolve: {
                    skipIfAuthenticated: _redirectIfNotAuthenticated
                }
            })
            .state('startup-new', {
                url: '/startup/new',
                templateUrl: '/js/angular/modules/startup/edit/edit.html',
                controller: 'EditStartupCtrl',
                resolve: {
                    skipIfAuthenticated: _redirectIfNotAuthenticated
                }
            })
            .state('startup-edit', {
                url: '/startup/:_id/edit',
                templateUrl: '/js/angular/modules/startup/edit/edit.html',
                controller: 'EditStartupCtrl',
                resolve: {
                    skipIfAuthenticated: _redirectIfNotAuthenticated
                }
            })
            .state('startup-view', {
                url: '/startup/:_id/view',
                templateUrl: '/js/angular/modules/startup/view/view.html',
                controller: 'ViewStartupCtrl'
            })
            .state('startup-list', {
                url: '/startup?:search',
                templateUrl: '/js/angular/modules/startup/list/list.html',
                controller: 'ListStartupCtrl'
            })
            .state('user-register', {url: '/user/register', templateUrl: '/js/angular/modules/user/register/register.html', controller: 'RegisterCtrl'})
            .state('user-login', {url: '/user/login', templateUrl: '/js/angular/modules/user/login/login.html', controller: 'RegisterCtrl',
                resolve: {
                    skipIfAuthenticated: _skipIfAuthenticated
                }
            });
    });