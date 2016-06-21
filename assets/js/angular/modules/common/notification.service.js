(function () {
    'use strict';

    angular
        .module('start.services')
        .factory('NotificationService', function ($resource, $localstorage, CONFIG) {

            return $resource(
                CONFIG.apiUrl + '/notification/:action',
                {},
                {
                    newUser: {
                        method: 'GET',
                        params: {
                            action: 'newUser'
                        }
                    },
                    startupPublished: {
                        method: 'GET',
                        params: {action: 'startupPublished'}
                    },
                    newComment: {
                        method: 'GET',
                        params: {action: 'newComment'}
                    },
                    clear: {
                        method: 'GET',
                        params: {action: 'clear'}
                    }
                });

            // private functions

            function handleSuccess(res) {
                return res;
            }

            function handleError(error) {
                return function () {
                    return {error: true, message: error};
                };
            }
        }
    );
})();