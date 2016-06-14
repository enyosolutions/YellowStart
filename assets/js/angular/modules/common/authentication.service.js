(function () {
    'use strict';

    angular.module('start.services')
        .factory('Auth', function($http, $localstorage, $rootScope, UserService, CONFIG) {
        return {
            ANONYMOUS : 'ANONYMOUS',
            USER : 'USER',
            ADMIN : 'ADMIN',
            authorize: function(access) {
                if (access === this.ANONYMOUS) {
                    return true;
                }

                else {
                    return this.isAuthenticated();
                }
            },
            isAuthenticated: function() {
                return $localstorage.get('auth_token');
            },
            login: function(email, password) {
                var login = $http.post(CONFIG.baseUrl + '/auth/login', {email:email, password: password});
                login.success(function(result) {
                    $localstorage.set('auth_token',result.token);
                    $localstorage.setObject('currentUser', result.user);
                });
                return login;
            },
            logout: function() {
                // The backend doesn't care about logouts, delete the token and you're good to go.
                $localstorage.remove('auth_token');
            },
            register: function(formData) {
                $localstorage.remove('auth_token');
                var register = $http.post(CONFIG.baseUrl + '/auth/register', formData);
                register.success(function(result) {
                    $localstorage.set('auth_token', JSON.stringify(result));
                });
                return register;
            }
        };
    });

})();