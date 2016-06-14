(function () {
    'use strict';

    angular
        .module('start.services')
        .factory('UserService', UserService);

    UserService.$inject = ['$http'];
    function UserService($http) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Login = Login;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get('/api/user').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get('/api/crud/user/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get('/api/user/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function Create(user) {
            return $http.post('/auth/register', user).then(handleSuccess, handleError("<h3><b>Nous n'avons pas réussi à créer votre compte.</b></h3>"));
        }
        function Login(user) {
            return $http.post('/auth/login', user).then(handleSuccess, handleError("Nous n'avons pas réussi à vous identifier"));
        }
        function Update(user) {
            return $http.put('/user/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/user/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res;
        }

        function handleError(error) {
            return function () {
                return { error: true, message: error };
            };
        }
    }

})();