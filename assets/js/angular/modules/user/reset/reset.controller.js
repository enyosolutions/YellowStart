'use strict';

angular.module('start.controllers').controller("ResetCtrl", function ($scope, $stateParams, $location, $ngBootbox, Auth, User, UserService) {
    $scope.pageClass = 'user-registration';

    (function initController() {
        // reset login status
        Auth.logout();
    })();
    console.log($stateParams.token);
    UserService.GetByToken($stateParams.token).then(function (res) {
        console.log(res);
        if (res && res.data) {
            $scope.currentUser = res.data;
        }

        else {
            $ngBootbox.alert('<h3>Token invalide</h3>');
        }
    });

    $scope.resetPassword = function () {
        if(!$scope.currentUser){
            return;
        }
        if ($scope.user.password !== $scope.user.confirmPassword) {
            $ngBootbox.alert('<h3>Le mot de passe et sa confirmation ne correspondent pas</h3>');
        }
        UserService.ResetPassword($stateParams.token, $scope.user.password ).then(function (response) {
            if (response && !response.status === 200) {
                $ngBootbox.alert('<h3>Votre mot de passe à bien été changé, vous pouvez maintenant vous connecter.</h3>');
            }
        });

    };
});