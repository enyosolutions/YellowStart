(function () {
    'use strict';

    angular.module('start.services').factory('AuthInterceptor', function ($q, $injector) {
        return {
            request: function (config) {
                var LocalService = $injector.get('$localstorage');
                var token;
                if (LocalService.get('auth_token')) {
                    token = angular.fromJson(LocalService.get('auth_token')).token;
                }
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            responseError: function (response) {
                var LocalService = $injector.get('$localstorage');
                if (response.status === 401 || response.status === 403) {
                    LocalService.unset('auth_token');
                    $injector.get('$state').go('user-register');
                }
                return $q.reject(response);
            }
        };
    })

})();