(function () {
    'use strict';

    angular.module('start.services').factory('AuthInterceptor', function ($q, $injector) {
        return {
            request: function (config) {
                console.log(config);
                var LocalService = $injector.get('$localstorage');
                var token;
                if (LocalService.get('auth_token')) {
                    token = LocalService.get('auth_token');
                }
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            responseError: function (response) {
                var LocalService = $injector.get('$localstorage');
                if (response.status === 401 || response.status === 403) {
                    LocalService.remove('auth_token');
                    $injector.get('$state').go('user-register');
                }
                return $q.reject(response);
            }
        };
    })

})();