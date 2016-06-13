'use strict';

angular.module('start.controllers').controller("RegisterCtrl", function($scope, $state, $location, AuthenticationService, UserService, $rootScope, $ngBootbox ) {

    $scope.register =  function() {
        $scope.dataLoading = true;
        console.log(UserService);

        UserService.Create($scope.user)
            .then(function (response) {
                console.log(response);
                $scope.dataLoading = false;

                if(response.error){
                        console.log(response);
                    $ngBootbox.alert(response.message);
                        //FlashService.Error(response.message);
                }
                if (response.data) {
                    $scope.user._id = response.id;
                    $rootScope.User = $scope.user;
                    $state.go('home');
                }
        });
    };
});