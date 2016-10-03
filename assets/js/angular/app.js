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
        'angucomplete-alt',
        'angular-jqcloud'
    ])
    .constant('CONFIG', window._config || {baseUrl: 'http://192.168.13.50:8080', apiUrl: 'http://192.168.13.50:8080/api' , lunaUrl: 'http://luna.startinpost.com/project/apilisttititata'})
   // .constant('CONFIG', {baseUrl: 'http://yellowstarter.com', apiUrl: 'http://yellowstarter.com/api' , lunaUrl: 'http://luna.startinpost.com/project/apilisttititata'})
    .run(function (editableOptions, $state, $rootScope, $interval, Auth, $localstorage, $ngBootbox, Notification, NotificationService, CONFIG) {
        editableOptions.theme = 'bs3';
        $rootScope.$state = $state;
        $rootScope.globals = {isMobile: angular.element('body').hasClass('mobile') };
        $rootScope.remoteHost = CONFIG.baseUrl;

        console.log(window._config );
        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            console.log('routechange success');
        });

        var user = $localstorage.getObject('currentUser');
        if (user) {
            $rootScope.globals.user = user;
            Auth.refresh().success(function (response) {
                console.log(response);
                $rootScope.globals.user = response.user;
                $rootScope.notifications = Notification.query({'query[userId]': $rootScope.globals.user._id});
                $interval(function () {
                    $rootScope.notifications = Notification.query({'query[userId]': $rootScope.globals.user._id});
                }, 60000);
                $rootScope.clearNotifications = function () {
                    NotificationService.clear({userId: $rootScope.globals.user._id})
                }
            }).error(function (err) {
                console.log(err);
                $state.go('user-register');
            });
        }

        $.ajaxSetup({
            headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')}
        });


        $rootScope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };


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
    .config(function ($ngBootboxConfigProvider) {
        $ngBootboxConfigProvider.addLocale('fr', {OK: 'OK', CANCEL: 'Annuler', CONFIRM: 'Confirmer'});
        $ngBootboxConfigProvider.setDefaultLocale('fr');

    })
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }])

    .directive('loadingScreen', ['$timeout', '$animate', function ($timeout, $animate) {
        return ({
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
    }])
    .directive("minifyOnScroll", function ($window) {
        return function (scope, element, attrs) {
            angular.element($window).bind("scroll", function () {
                if (this.pageYOffset >= 200) {
                    scope.minified = true;
                    console.log('Scrolled below header.');
                } else {
                    scope.minified = false;
                    console.log('Header is in view.');
                }
                scope.$apply();
            });
        };
    });

;