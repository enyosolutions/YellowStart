(function () {
    'use strict';

    angular.module('start.services').factory('AuthInterceptor', function ($q, $injector) {
        return {
            request: function (config) {
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
                    var $state = $injector.get('$state');
                    console.log($state.current.data);
                    if ($state.current.data && $state.current.data.access !== 'ANONYMOUS') {
                        LocalService.remove('auth_token');
                        $state.go('user-register');
                    }
                }
                return $q.reject(response);
            }
        };
    })

})();