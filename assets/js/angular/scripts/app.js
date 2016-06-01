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
        'ngSanitize',
        'ngTouch',
        'xeditable',
        'ngBootbox',
        'ngDropzone',
        'selectize'
    ])
    .constant('CONFIG', {baseUrl: 'http://colette.enyosolutions.com/api', apiUrl: '/api'}).
run(function(editableOptions) {
    editableOptions.theme = 'bs3';
})
;
