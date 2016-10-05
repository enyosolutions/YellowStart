'use strict';

angular.module('start.controllers').controller("ProfileCtrl", function ($scope, $state, Auth, $rootScope, Startup, $log, $localstorage, $ngBootbox, $http, UserService, CONFIG) {

    $scope.pictureZone = {
        addedFile: function (file, error) {
        },

        removedFile: function (file) {
            $http.post('/user/delete-picture');
            $rootScope.globals.user.picture = '';
            return true;
        },
        
        error: function (file, errorMessage) {
            $log.log(errorMessage);
            $ngBootbox.alert("<h2 class='text-center text-danger'>" + errorMessage + "</h2>");
        },
        success: function (file, response) {
            console.log(response);
            if (response.body) {
                $rootScope.globals.user.picture = response.body;
            }
        },
        dropzoneConfig: {
            url: CONFIG.baseUrl + "/user/upload-picture",
            paramName: "file",
            parallelUploads: 1,
            maxFileSize: 10,
            maxFiles: 1,
            addRemoveLinks: true,
            dictDefaultMessage: "Glissez pour ajouter image ou cliquer pour parcourir",
            acceptedFiles: 'image/*',
            headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')}
        }
    };

    if(false){
        $scope.requestedStartups = Startup.query({'analysisRequested': 1});
    }

    $scope.logout = function(){
        Auth.logout();
        $state.go('user-register');
    }

    $scope.updateProfile = function(){
        UserService.Update($rootScope.globals.user);
    };

    $scope.sortByName = function () {
        $scope.starredStartups = Startup.query(angular.extend({ 'sort[startupName]': 1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByViews = function () {
        $scope.starredStartups = Startup.query(angular.extend({'sort[meta.views]': -1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByCreatedDate = function () {
        $scope.starredStartups = Startup.query(angular.extend({'sort[createdAt]': -1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByBookmarks = function () {
        $scope.starredStartups = Startup.query(angular.extend({ 'sort[meta.bookmarks]': -1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.sortByNoteSip = function () {
        $scope.starredStartups = Startup.query(angular.extend({'sort[sipScore]': -1}, {ids: $rootScope.globals.user.bookmarks}));
    };

    $scope.pageClass = 'user-profile';
    console.log($rootScope.globals.user);
    $scope.starredStartups = Startup.query({ids: $rootScope.globals.user.bookmarks});
});
