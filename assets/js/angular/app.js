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
    .module('startApp', [
        'start.controllers', 'start.services',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'xeditable',
        'ngBootbox',
        'ngDropzone',
        'selectize',
        'datePicker',
        'angucomplete-alt'
    ])
    //.constant('CONFIG', {baseUrl: 'http://start.dev:8080', apiUrl: 'http://start.dev:8080/api', lunaUrl: 'http://luna.startinpost.com/project/apilisttititata'})
     .constant('CONFIG', {baseUrl: 'http://192.168.12.14:8080', apiUrl: 'http://192.168.12.14:8080/api'})
    // .constant('CONFIG', {baseUrl: 'http://yellowstart.enyosolutions.com', apiUrl: 'http://yellowstart.enyosolutions.com/api'})
    .run(function (editableOptions, $state, $rootScope, Auth, $localstorage, $ngBootbox, CONFIG) {
        editableOptions.theme = 'bs3';
        $rootScope.$state = $state;
        $rootScope.globals = {};
        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            console.log('routechange success');
        });

        var user = $localstorage.getObject('currentUser');
        if (user) {
            $rootScope.globals.user = user;
            Auth.refresh().success(function(response){
                console.log(response);
                $rootScope.globals.user = response.user;
            });
        }

        $.ajaxSetup({
            headers: { 'Authorization':  'Bearer ' + $localstorage.get('auth_token') }
        });


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            window.scrollTo(0, 0);
            $ngBootbox.hideAll();
            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();
                $state.go('user-register');
            }
        });
    }).
    config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .config(function($ngBootboxConfigProvider) {
        $ngBootboxConfigProvider.addLocale('fr', { OK: 'OK', CANCEL: 'Annuler', CONFIRM: 'Confirmer' });
        $ngBootboxConfigProvider.setDefaultLocale('fr');

    })
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])

    .directive('loadingScreen', ['$timeout', '$animate', function($timeout, $animate) {
        return({
            link: link,
            restrict: "C"
        });

        function link(scope, element, attributes) {
            $animate.leave(element.children().eq(1)).then(
                function cleanupAfterAnimation() {
                    $timeout(function () {
                        scope.startFade = true;

                        $timeout(function () {
                            element.remove();

                            scope.unlocked = true;
                            scope = element = attributes = null;
                        }, 500);
                    }, 1000);
                }
            );
        }
    }]);