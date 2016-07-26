'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('ViewStartupCtrl', function ($scope, $rootScope, $stateParams, $window, $timeout, $sce, $ngBootbox, Startup, StartupComment, StartupContact, UserService, NotificationService) {
        $scope.pageClass = 'startup-view';

        $scope.iframeUrl = function (src) {
            return $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + src);
        };

        if ($stateParams._id) {
            $scope.startup = new Startup({_id: $stateParams._id});
            $scope.startup.$get().then(function () {
                UserService.GetById($scope.startup.createdBy).then(function(res){
                    console.log(res);
                    $scope.startupCreator = res.data;
                });
                $scope.startupContacts = StartupContact.query({'query[startupId]': $stateParams._id}).$promise.then(function (res) {
                    var content;
                    $scope.startupContacts = res;
                    if (res.length > 0) {
                        var contact = res[0];
                        content = '<div class="startup-map-infowindow" style="width: 195px;height:265px;">' +
                        '<div class="inner">' +
                        '<div class="name">' + $scope.startup.startupName + '</div> ' +
                        '<div class="address">' + ($scope.startup.address ? $scope.startup.address : '' ) + '</div> ' +
                        '<div class="phone">' + (contact.phonenumber ? contact.phonenumber : "") + '</div> ' +

                        (contact.email ?
                        '<div class="email"><a target="_blank" href="mailto:' + contact.email + '" >' + contact.email + '</a></div> '
                            : "" ) +
                        '</div>' +
                        '</div>';

                    }
                    else {
                        content = '<div class="startup-map-infowindow" style="width: 195px;height:265px;">' +
                        '<div class="inner">' +
                        '<div class="address">' + ($scope.startup.address ? $scope.startup.address : '' ) + '</div> ' +
                        '</div>' +
                        '</div>';
                    }
                    $scope.displayWebsiteUrl = $scope.startup.websiteUrl.replace(/http(s)?:\/\//i, '');
                    initGooglemaps($scope.startup.address, content);
                });

            });


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
        $scope.relatedStartups = Startup.query({'publishedOnly': 1, 'related': $stateParams._id, limit: 3});

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


        $scope.bookmarkStartup = function () {
            if (!$rootScope.globals.user.bookmarks) {
                $rootScope.globals.user.bookmarks = [];
            }
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

        function initGooglemaps(address, infoboxContent) {
            var map = '';
            var geocoder = new google.maps.Geocoder();
            var address = address;

            geocoder.geocode({'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();

                    initialize(latitude, longitude, infoboxContent);
                }
            });
        };

        // REQUEST AN ANALYSIS FROM STARTINPOST
         $scope.requestAnalysis = function() {
            NotificationService.requestAnalysis({startupId: $scope.startup._id, fromEmail: $rootScope.globals.user.email}).$promise.then(
                function(){$ngBootbox.alert("<h3>Demande d'analyse envoyée</h3>" );}
            );
        };


        //INITIALIZE GOOGLE MAPS.
        function initialize(latitude, longitude, infoboxContent) {
            console.log(latitude, longitude);
            console.log(latitude + 0.5900);
            var latLng = new google.maps.LatLng(latitude, longitude);
            var latLng2 = new google.maps.LatLng(latitude + 0.03, longitude);
            console.log(latLng2);
            var mapOptions = {
                zoom: 12,
                scrollwheel: false,
                panControl: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false,
                navigationControl: false,
                draggable: true,
                center: latLng2
            };

            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            console.log(map);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: '/images/spacer.gif'
            });

            var infoBubble = new InfoBubble({
                width: 300,
                borderRadius: 0,
                arrowSize: 20,
                borderWidth: 0,
                shadowStyle: 0,
                content: infoboxContent ? infoboxContent : ''
            });

            infoBubble.open(map, marker);
            $timeout(function(){
               map.setCenter(latLng2);
            },5000);
            google.maps.event.addDomListener(window, 'resize', function () {
                map.setCenter(latLng);
            });
        }

    }).directive('documentSlider', function () {
        return function (scope, element) {
            console.log(scope, element);
            if (scope.$last) {

                console.log(element.parent());
                element.parent().slick({
                    infinite: true,
                    variableWidth: false,
                    speed: 300,
                    centerMode: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    initialSlide: 1
                });
            }
        };
    });
