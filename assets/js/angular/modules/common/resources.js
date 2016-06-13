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
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        };
    }])
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
        return $resource(CONFIG.apiUrl + '/api/user/:_id', {_id: '@_id'},
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
                "google": {isArray: false, cancellable: false, method: "GET", params:{action:'google'}, transformResponse: transformGet}
            });

    });

function transformGet(json, headerGetter) {
    var jsonParsed = angular.fromJson(json);
    return ( jsonParsed && jsonParsed.body ? jsonParsed.body : jsonParsed);
}

