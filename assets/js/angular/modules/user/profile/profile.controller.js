'use strict';

angular.module('start.controllers').controller("ProfileCtrl", function ($scope, $rootScope, Startup, $log, $localstorage, $ngBootbox, UserService, CONFIG) {

    $scope.pictureZone = {
        addedFile: function (file, error) {
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
            dictDefaultMessage: "Glissez une image pour l'ajouter",
            acceptedFiles: 'image/*',
            headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')}
        }
    };

    if(false){
        $scope.requestedStartups = Startup.query({'analysisRequested': 1});
    }

    $scope.updateProfile = function(){
        $rootScope.globals.user.$update();
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

    $scope.pageClass = 'user-profile';
    console.log($rootScope.globals.user);
    $scope.starredStartups = Startup.query({ids: $rootScope.globals.user.bookmarks});
});