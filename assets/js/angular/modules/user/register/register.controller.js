'use strict';

angular.module('start.controllers').controller("RegisterCtrl", function ($scope, $state, $location, Auth, UserService, $rootScope, $ngBootbox) {
    $scope.pageClass = 'user-registration';

    $scope.register = function () {

        if($scope.user.password !== $scope.user.confirmPassword){
            $ngBootbox.alert('<h3>Le mot de passe et sa confirmation ne correspondent pas</h3>');
        }
        else {
            $scope.dataLoading = true;
            Auth.register($scope.user)
                .success(function (response) {
                    console.log(response);
                    $scope.dataLoading = false;

                    if (!response || response.error) {
                        console.log(response);
                        $ngBootbox.alert(response.message);
                        //FlashService.Error(response.message);
                    }
                    if (response && response.user) {
                        $rootScope.globals.user = response.user;
                        $state.go('home');
                    }
                }).error(function (response) {
                    $scope.dataLoading = true;
                    if (response && response.error) {
                        $ngBootbox.alert("<h2 class='text-center text-danger'>" + response.error + "</h2>");
                    }
                    else {
                        $ngBootbox.alert("une erreur s'est produite lors de l'inscription. Merci de vérifier les informations que vous avez saisies.");
                    }
                    console.log(response);
                });
        }
    };

    $scope.login = function (email, password) {
        console.log(email);
        $scope.dataLoading = true;

        Auth.login(email, password)
            .success(function (response) {
                console.log(response);
                $scope.dataLoading = false;

                if (response.user) {
                    $rootScope.globals.user = response.user;
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
                if (response && response.error) {
                    $ngBootbox.alert("<h2 class='text-center text-danger'>" + response.error + "</h2>");
                }
                else {
                    $ngBootbox.alert("Il s'est produit une erreur lors de la connexion");
                }
                console.log(response);
            });
    };

    $scope.logout = function () {
        Auth.logout();
        $state.go('home');
    };
});