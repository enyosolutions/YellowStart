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
        $urlRouterProvider.otherwise('user-register');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/js/angular/modules/startup/list/home.html',
                controller: 'ListStartupCtrl'
            })
            .state('startup-new', {
                url: '/startup/new',
                templateUrl: '/js/angular/modules/startup/edit/edit.html',
                controller: 'EditStartupCtrl'
            })
            .state('startup-edit', {
                url: '/startup/:_id/edit',
                templateUrl: '/js/angular/modules/startup/edit/edit.html',
                controller: 'EditStartupCtrl'
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
            .state('user-login', {url: '/user/login', templateUrl: '/js/angular/modules/user/login/login.html', controller: 'RegisterCtrl'});
    });