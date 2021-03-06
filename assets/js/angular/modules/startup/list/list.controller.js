'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */



angular.module('start.controllers')

    .controller('ListStartupCtrl', function ($scope, $rootScope, $state, $stateParams, $location, $window, $timeout, $routeParams, Startup, Crawler, HomeSlider, HomeMobileSlider, CONFIG) {
        $scope.recentStartupList = {};
        $scope.pageClass = 'startup-list';
        $scope.currentPage = 0;
        $scope.remoteHost = CONFIG.baseUrl;
        $scope.q = '';
        $scope.slides = $rootScope.globals.isMobile && (!$rootScope.globals.isLandscape) ? HomeMobileSlider.query() : HomeSlider.query();
        var query = {'publishedOnly': 1};
        var $searchInput = $('#search_value');


        // global search function
        $scope.search = function (q) {
            console.log('SEARCH', $scope.searchName);
            $state.go('startup-list', {search: $scope.searchName});
            return;
        };

        $scope.searchAutocomplete = function (selection) {
            console.log('AUTOCOMPLETE SELECTED', selection);
            $rootScope.barBlurred();
            if (selection) {
                if (selection.originalObject.type === 'startup') {
                    $state.go('startup-view', {_id: selection.originalObject.id});
                }
                else {
                    switch (selection.originalObject.type) {
                        case 'startup':
                        case 'default':
                            $scope.searchName = selection.title;
                            $scope.search(selection.title);
                            break;
                        case 'tag':
                            console.log(selection);
                            $scope.searchName = selection.title;
                            delete $stateParams.search;
                            $state.go('startup-list', {tag: selection.originalObject.id});
                            break;
                        case 'button':
                            $scope.searchName = selection.originalObject.title;
                            selection.title = selection.originalObject.title;
                            // $scope.$broadcast('angucomplete-alt:changeInput', 'search', selection.title);
                            delete $stateParams.tag;
                            $scope.search($scope.searchName);
                            break;
                    }
                }
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };

        $scope.searchAutocompleteCHG = function (q) {
            console.log('AUTOCOMPLETE CHANGED', q);
            $scope.searchName = q;
        };


        // ADD A ORANGE BUTTON ON THE BOTTOM OF THE SEARCH AUTOCOMPLETE
        $scope.appendMoreButtons = function (res) {
            console.log(res);
            if (res.body.length > 1) {
                res.body = res.body.slice(0, 6);
            }
            res.body.push({label: "Afficher tous les résultats", type: 'button', title: $scope.searchName});
            return res;
        }


        //@deprecated DELETE A STARTUP
        $scope.deleteStartup = function (id) {
            var c = $scope.startupList.splice(id, 1);
            console.log(c);
            Startup.delete({_id: c[0]._id});

        };


        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
            $scope.searchedStartups = Startup.query(angular.extend({page: $scope.currentPage}, query));
        };


        $scope.nextPage = function () {
            $scope.currentPage++;
            $scope.searchedStartups = Startup.query(angular.extend({page: $scope.currentPage}, query));
        };

        $scope.sortByName = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[startupName]': 1}, query));
        };

        $scope.sortByViews = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[meta.views]': -1}, query));
        };
        $scope.sortByCreatedDate = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[createdAt]': -1}, query));
        };

        $scope.sortByBookmarks = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[meta.bookmarks]': -1}, query));
        };

        $scope.sortByNoteSip = function () {
            $scope.searchedStartups = Startup.query(angular.extend({'sort[sipScore]': -1}, query));
        };


        $rootScope.barFocused = function (e) {
            console.log('Focus callback function call');
            if (!$state.is('startup-list')) {
                $rootScope.barIsFocused = true;
                $timeout(function () {
                    console.log('bar focus function call');
                    $searchInput.focus().select();
                }, 300);
            }
        };

        //  $window.barFocused = $scope.barFocused;

        $rootScope.barBlurred = function () {
            console.log('bar blurred');
            $rootScope.barIsFocused = false;
        };

        $rootScope.toggleNavBar = function (open) {
            $rootScope.minified = open || true;
        };

        $window.focusOnClick = function () {
            console.log('HOME');
            $timeout(function () {
                // angular.element('#search_value').triggerHandler('focus');
                $('#search_value').focus();
                // $('#navbar-main').addClass('nav-focus');
                // $rootScope.barIsFocused = true;
                $scope.$apply();
            }, 250);
        };

        if ($stateParams.tag) {
            $scope.searchTitle = $stateParams.tag;
            query.tag = $stateParams.tag.replace(/#/g, '');
            $scope.searchedStartups = Startup.query(query);
        }

        if ($stateParams.search) {
            $scope.searchTitle = $stateParams.search;
            query.search = $stateParams.search.replace(/#/g, '');
            $scope.searchedStartups = Startup.query(query);
        }

        $scope.recentStartupList = Startup.query({'publishedOnly': 1, 'sort[lastModifiedAt]': -1});
        $scope.mostViewedStartupList = Startup.query({'publishedOnly': 1, 'sort[meta.views]': -1});
        $scope.bestScoreStartupList = Startup.query({'publishedOnly': 1, 'sort[sipScore]': -1});
        $scope.mostBookmarkedStartupList = Startup.query({'publishedOnly': 1, 'sort[meta.bookmarks]': -1});
        $scope.lessViewedStartupList = Startup.query({'publishedOnly': 1, 'sort[meta.views]': 1});

        Crawler.tags().$promise.then(function (res) {
                res = res.map(function (e) {
                    e.link = '#/startup?tag=' + e.text;
                    return e;
                });
                $scope.tagCloud = res;
            }
        );
    })

    .directive('homeSlider', function () {
        return function (scope, element) {
            if (scope.$last) {
                element.parent().cycle({
                    slides: '.slide',
                    pager: '> .cycle-pager',
                    maxZ: 100
                });
            }
        };
    })

        .directive('homeSlider2', function () {
        return function (scope, element) {
            if (scope.$last) {
                element.parent().cycle({
                    slides: '.slide',
                    pager: '> .cycle-pager',
                    maxZ: 100
                });
            }
        };
    })

    .directive('targetClick', function ($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function(e) {
                    angular.element(attrs.targetClick).trigger('click');
                    $('body').animate({scrollTop :0}, '200');
                });
            }
        };
    })

    .directive('startupSlider', function () {
        return function (scope, element) {
            if (scope.$last) {
                element.parent().slick({
                    infinite: false,
                    variableWidth: true,
                    speed: 300,
                    centerMode: false,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    swipeToSlide: true,
                    responsive: [
                      {
                        breakpoint: 1300,
                        settings: {
                          slidesToShow: 3
                        }
                      },
                      {
                        breakpoint: 1024,
                        settings: {
                          slidesToShow: 2
                        }
                      },
                      {
                        breakpoint: 600,
                        settings: {
                          slidesToShow: 1
                        }
                      }
                    ]
                });
            }
        };
    })

;
