(function () {
    'use strict';

    angular
        .module('start.services')
        .factory('UserService', function ($http, $localstorage, CONFIG) {
            var service = {};

            service.GetAll = GetAll;
            service.GetById = GetById;
            service.GetByToken = GetByToken;
            service.ResetPassword = ResetPassword;
            service.Create = Create;
            service.Update = Update;
            service.Delete = Delete;
            var u = $localstorage.getObject('currentUser');
            if (u) {
                service.currentUser = u;
            }
            return service;

            function GetAll() {
                console.log("list all");
                return $http.get(CONFIG.baseUrl + '/api/crud/user').then(handleSuccess, handleError('Error getting all users'));
            }

            function GetById(id) {
                return $http.get(CONFIG.baseUrl + '/api/crud/user/' + id).then(handleSuccess, handleError('Error getting user by id'));
            }

            function GetByToken(token) {
                return $http.get(CONFIG.baseUrl + '/user/token/' + token).then(handleSuccess, handleError('Error getting user by username'));
            }

            function ResetPassword(token, password) {
                return $http.post(CONFIG.baseUrl + '/user/reset/' + token, {password: password}).then(handleSuccess, handleError('Error getting user by username'));
            }

            function Create(user) {
                return $http.post(CONFIG.baseUrl + '/auth/register', user);
            }

            function Update(user) {
                var u = angular.extend(this.currentUser, user);
                var that = this;
                return $http.put(CONFIG.baseUrl + '/auth/update/' + user._id, u).then(function (res) {
                    service.currentUser = u, handleSuccess(res);
                }, handleError('Error updating user'));
            }

            function Delete(id) {
                return $http.delete(CONFIG.baseUrl + '/api/user/' + id).then(handleSuccess, handleError('Error deleting user'));
            }

            // private functions

            function handleSuccess(res) {
                return res;
            }

            function handleError(error) {
                return function () {
                    return {error: true, message: error};
                };
            }
        }
    );
})();