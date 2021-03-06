'use strict';

angular.module('start.controllers').controller("RegisterCtrl", function ($scope, $state, $location, Auth, Utils, UserService, $rootScope, $ngBootbox) {
    $scope.pageClass = 'user-registration';
    $scope.accountCreated = false;

    $scope.register = function () {

        if($scope.user.password !== $scope.user.confirmPassword){
            $ngBootbox.alert('<h3>Le mot de passe et sa confirmation ne correspondent pas</h3>');
        }
        else if(!Utils.validateEmail($scope.user.email)){
            $ngBootbox.alert("<h3>Merci de vérifier le format de votre adresse email.</h3>");
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
                        $ngBootbox.alert("<h2 class='text-center text-success'>Merci pour votre inscription.<br/>Vous allez recevoir un mail d'activation dans quelques instants. (Vérifiez votre dossier spam).</h2>");
                        $scope.user = {};
                        $scope.accountCreated = true;
                    }
                }).error(function (response) {
                    $scope.dataLoading = false;
                    if (response && response.error) {
                        $ngBootbox.alert("<h2 class='text-center text-danger'>" + response.error + "</h2>");
                    }
                    else {
                        $ngBootbox.alert("une erreur s'est produite lors de l'inscription. Merci de vérifier les informations que vous avez saisies.");
                    }
                });
        }
    };

    $scope.login = function (email, password) {
        $scope.dataLoading = true;

        Auth.login(email, password)
            .success(function (response) {
                console.log(response);
                $scope.dataLoading = false;

                if (response.user && response.user.isActive && (response.user.roles.indexOf('USER') > -1 || response.user.roles.indexOf('ADMIN') > -1)) {
                    $rootScope.globals.user = response.user;
                    $state.go('home');
                }
                else {
                    if (response.error) {
                        $ngBootbox.alert(response.error);
                    }
                    else if (!response.user.isActive ){
                        $ngBootbox.alert("Votre compte n'a pas encore été activé. Il devrait l'être d'ici quelques heures.");
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
        $state.go('user-register');
    };

    $scope.resetPassword = function(){
        $ngBootbox.prompt('<h3>Saisissez votre adresse Email pour récupérer votre mot de passe.</h3>').then(function(email){
            console.log(email);
            Auth.forgot(email).then(function(res){
                if(res){
                    $ngBootbox.alert('<h3>Un lien de récupération vous a été envoyé par mail.</h3>');
                }
            },function(err){
                if(err.error){
                $ngBootbox.alert('<h3>' + err.error + '</h3>');
                }
            });
        });
    }
});