'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('ViewStartupCtrl', function ($scope, $routeParams, Startup) {
        $scope.pageClass = 'view-page';

        if ($routeParams._id) {

            $scope.startup = new Startup({_id:$routeParams._id});
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
        console.log($scope.startup);
    });
