'use strict';

angular.module('start.controllers').controller("RegisterCtrl", function ($scope, $state, $location, Auth, UserService, $rootScope, $ngBootbox) {

    $scope.register = function () {
        $scope.dataLoading = true;
        console.log(UserService);

        Auth.register($scope.user)
            .success(function (response) {
                console.log(response);
                $scope.dataLoading = false;

                if (response.error) {
                    console.log(response);
                    $ngBootbox.alert(response.message);
                    //FlashService.Error(response.message);
                }
                if (response.data) {
                    $scope.user._id = response.id;
                    $rootScope.User = $scope.user;
                    $state.go('home');
                }
            }).error(function (response) {
                if (response.error) {
                    $ngBootbox.alert("<h2 class='text-center text-danger'>" + response.error + "</h2>");
                }
                else {
                    $ngBootbox.alert("une erreur s'est produite lors de l'inscription. Merci de vérifier les informations que vous avez saisies.");
                }
                console.log(response);
            });
    };

    $scope.login = function (email, password) {
        console.log(email);
        $scope.dataLoading = true;

        Auth.login(email, password)
            .success(function (response) {
                console.log(response);
                $scope.dataLoading = false;

                if (response.data) {
                    $scope.user._id = response.id;
                    $rootScope.User = $scope.user;
                    $state.go('home');
                }
                else {
                    if (response.error) {
                        $ngBootbox.alert(response.error);
                    }
                    console.log(response);
                }
            })
            .error(function (response) {
                if (response.error) {
                    $ngBootbox.alert("<h2 class='text-center text-danger'>" + response.error + "</h2>");
                }
                else {
                    $ngBootbox.alert("Il s'est produit une erreur lors de la connexion");
                }
                console.log(response);
            });
    };
});