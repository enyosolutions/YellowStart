'use strict';

angular.module('start.controllers').controller("LoginCtrl", function($location, Auth, FlashService) {
    var vm = this;

    vm.login = login;

    (function initController() {
        // reset login status
        Auth.ClearCredentials();
    })();

    function login() {
        vm.dataLoading = true;
        Auth.login(vm.username, vm.password, function (response) {
            if (response.success) {
                Auth.SetCredentials(vm.username, vm.password);
                $location.path('/');
            } else {
                FlashService.Error(response.message);
                vm.dataLoading = false;
            }
        });
    };
});