angular.module('start.services')
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                return delete $window.localStorage[key] && $window.localStorage;
            },
            unset: function (key) {
                return delete $window.localStorage[key] && $window.localStorage;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        };
    }])
    .factory('CheapFaresService', function ($resource, CONFIG) {
        return $resource(CONFIG.restUrl + '/faredeal/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: false, method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    // LIST OF STARTUPS
    .factory('Startup', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/startup/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })
    })
       // LIST OF STARTUPS
    .factory('LunaStartup', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/luna-startup/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })
    })
    // LIST OF CONTACTS FOR THE STARTUP
    .factory('StartupContact', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/startup-contact/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })
    })
    // LIST OF COMMENTS ON THE STARTUP
    .factory('StartupComment', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/startup-comment/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })
    })
    .factory('StartupFile', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/startup-file/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('Tag', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/tag/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('UserBookmarks', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/user/bookmark/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('User', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/user/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('Notification', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/user-notification/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('AdminUser', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/user/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('HomeSlider', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/home-slider/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('HomeMobileSlider', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crud/home-mobile-slider/:_id', {_id: '@_id'},
            {
                "update": {isArray: false, method: "PUT", transformResponse: transformGet},
                "save": {isArray: false, cancellable: false, method: "POST", transformResponse: transformGet},
                "query": {isArray: true,  method: "GET", transformResponse: transformGet},
                "get": {isArray: false, cancellable: false, method: "GET", transformResponse: transformGet}
            })

    })
    .factory('Crawler', function ($resource, CONFIG) {
        return $resource(CONFIG.apiUrl + '/crawler/:action', {action:''},
            {
                "meta": {isArray: false, cancellable: false, method: "GET", params:{action:'meta'}, transformResponse: transformGet},
                "google": {isArray: false, cancellable: false, method: "GET", params:{action:'google'}, transformResponse: transformGet},
                "tags": {isArray: true, cancellable: false, method: "GET", params:{action:'tags'}, transformResponse: transformGet}
            });

    });

function transformGet(json, headerGetter) {
    var jsonParsed = angular.fromJson(json);
    return ( jsonParsed && jsonParsed.body ? jsonParsed.body : jsonParsed);
}

