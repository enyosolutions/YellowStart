'use strict';

angular.module('start.controllers').controller("RegisterCtrl", function($location, AuthenticationService, FlashService) {
    var vm = this;

    vm.register = register;

    function register() {
        vm.dataLoading = true;
        UserService.Create(vm.user)
            .then(function (response) {
                if (response.success) {
                    FlashService.Success('Registration successful', true);
                   // $location.path('/login');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
    }
});