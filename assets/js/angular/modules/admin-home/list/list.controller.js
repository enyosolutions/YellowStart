'use strict';

angular.module('start.controllers').controller("AdminHomeCtrl", function ($scope, $location, $filter, $localstorage, Auth, AdminUser, UserService, $ngBootbox, HomeSlider, CONFIG) {
    $scope.newSlide = {};
    $scope.slides = HomeSlider.query();
    $scope.activateUser = function (index) {
        $scope.users[index].isActive = true;
        $scope.users[index].$update();
    };

    $scope.deleteSlide = function (index) {
        console.log(index, $scope.slides);
        if ($scope.slides[index]) {
            $scope.slides[index].$delete();
            $scope.slides.splice(index, 1);
        }
    };

    $scope.createSlide = function () {
        console.log($scope.newSlide);
        var slide = new HomeSlider($scope.newSlide);
        slide.$save();
        $scope.slides.push(slide);
        $scope.dropZone.removeAllFiles(true);
        scope.newSlide = {};
    };


    $scope.pictureZone = {
        addedFile: function (file) {
        },

        error: function (file, errorMessage) {
        },
        success: function (file, response) {
            console.log(response);
            if (response.body) {
                $scope.newSlide.picture = response.body;
            }
        },
        dropzoneConfig: {
            paramName: "file",
            url: CONFIG.baseUrl + "/api/admin/upload-picture",
            parallelUploads: 1,
            maxFileSize: 10,
            dictDefaultMessage: "Cliquez ou Glissez une image pour l'ajouter",
            acceptedFiles: 'image/*',
            headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')},
            init: function(){
                $scope.dropZone = this;
            }
        }
    };


});