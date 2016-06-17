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
            refresh: function(email, password) {
                var login = $http.get(CONFIG.baseUrl + '/auth/user');
                login.success(function(result) {
                    result.user._id = result.user.id;
                    delete result.user.id;
                    $localstorage.setObject('currentUser', result.user);
                });
                return login;
            },
            login: function(email, password) {
                var login = $http.post(CONFIG.baseUrl + '/auth/login', {email:email, password: password});
                login.success(function(result) {
                    console.log(result);
                    $localstorage.set('auth_token',result.token);
                    result.user._id = result.user.id;
                    delete result.user.id;
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
                var register = UserService.Create(formData);
                register.success(function(result) {
                    $localstorage.set('auth_token', result.token);
                });
                return register;
            }
        };
    });

})();