'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('ViewStartupCtrl', function ($scope, $rootScope, $stateParams, $sce, Startup, StartupComment, StartupContact, UserService, NotificationService) {
        $scope.pageClass = 'startup-view';

        $scope.iframeUrl = function (src) {
            return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + src);
        };

        if ($stateParams._id) {
            $scope.startup = new Startup({_id: $stateParams._id});
            $scope.startupContacts = StartupContact.query({'query[startupId]': $stateParams._id});
            $scope.startup.$get();
        }
        else {
            $scope.startup = {
                'startupName': 'Souscritoo',
                'tags': ['home', 'service'],
                'tagline': 'La souscription multiservices en 1 clic',
                'category': 'iot',
                'websiteUrl': 'http://www.souscrito.com',
                'projectTweet': 'Vous déménagez ? Souscrivez en un coup de fil tous vos contrats d\'électricité, gaz, box & assurance. 20 min max. Zéro papier. 100% gratuit.',
                'offerServices': "Lors des déménagements, les clients doivent souscrire électricité, gaz box et " +
                "assurance habitation, processus pénible et sans intérêt. Grâce aux services de Souscritoo, en nous appelant," +
                "les clients peuvent souscrire d'un seul coup tous ces contrats en moins de 20 minutes, et avec zéro papiers" +
                "(adresse et RIB suffisent) - résiliation des an ciens contrats incluse." +
                "Ce service est bien évidement gratuit. Souscritoo permet à ses client d’économiser 300€/an et " +
                " ses offres sont sans engagement. Souscritoo innove en proposant un service 100% GRATUIT " +
                " aux consommateurs dans le but spécifique de prendre en charge leur démarches post " +
                " déménagement (aucune entreprise ne le faisant actuellement).",
                'offerStrengths': '',
                'offerAccess': '',
                'offerBusiness': '',
                MarketDescription: "",
                MarketClients: "",
                MArketCompetitors: "",
                'team': '',
                'existingCustomers': '',
                'rewards': '',
                'funds': '',
                'revenues': '',
                'otherRevenues': '',
                'progress': '',
                'partnerships': ''
            };

        }
        $scope.isBookmarked = $rootScope.globals.user.bookmarks && $rootScope.globals.user.bookmarks.indexOf($scope.startup._id) > -1 ? true : false;


        $scope.comments = StartupComment.query({'query[startupId]': $stateParams._id});
        $scope.relatedStartups = Startup.query({'related': $stateParams._id, limit: 3});

        $scope.saveComment = function (text) {
            var comment = new StartupComment({
                userName: $rootScope.globals.user.firstname + ' ' + $rootScope.globals.user.lastname,
                text: text,
                startupId: $stateParams._id,
                userId: $rootScope.globals.user._id
            });
            comment.$save().then(function (response) {
                $scope.newCommentText = "";
                $scope.comments.push(response);
                NotificationService.newComment({startupId: $scope.startup._id});
            });
        };


        $scope.deleteStartup = function () {
            if ($rrotScope.globals.user.roles.indexOf('ADMIN') !== -1) {
                $scope.startup.$delete().$promise.then(function(res){
                   $state.go('startup-list');
                });
            }

        }
        $scope.bookmarkStartup = function () {
            var index = $rootScope.globals.user.bookmarks.indexOf($stateParams._id);
            console.log('removing items ', index);

            if (index === -1) {
                $rootScope.globals.user.bookmarks.push($stateParams._id);
                $scope.isBookmarked = true;
            }
            else {
                console.log($rootScope.globals.user.bookmarks.splice(index, 1), $rootScope.globals.user.bookmarks);
                $scope.isBookmarked = false;
            }
            UserService.Update($rootScope.globals.user);
        };
    })
;
