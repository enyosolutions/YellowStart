'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:EditStartupCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('EditStartupCtrl', function ($scope, $rootScope, $stateParams, $location, $localstorage, $timeout, $ngBootbox, $compile, $log, Startup, StartupContact, Utils, Tag, Crawler, NotificationService, CONFIG) {
        $scope.pageClass = 'startup-edit';
        $scope.pageClass = 'edit-page';
        $scope.startup = {};
        $scope.startupContacts = []; // LIST OF CONTACT OF THE STARTUP
        $scope.newContact = {}; // NEW CONTACT FOR ADDING AND EDITING FORM
        $scope.selectedTags = [];
        if ($scope.startup.tags) {
            $scope.selectedTags = $scope.startup.tags;
        }
        // SELECTIZE
        $scope.tagsOptions = Tag.query();
        $scope.tagsConfig = {
            create: true,
            valueField: 'slug',
            labelField: 'label',
            delimiter: '|',
            maxItems: 5,
            items: $scope.selectedTags,
            placeholder: 'Choisissez un ou plusieurs tags',
            onInitialize: function (selectize) {
            },
            onOptionAdd: function (value, data) {
                data.slug = slugify(data.slug);
                console.log(value, data);
                delete data.$order;
                var t = new Tag(data);
                t.$save();
            },
            onChange: function (value) {
                console.log(value);
                $scope.startup.tags = value.map(slugify);
                $scope.saveStartup();
            }

        };

        $scope.pictureZone = {
            addedFile: function (file) {
                $log.log(file);
            },

            error: function (file, errorMessage) {
                $log.log(errorMessage);
            },
            success: function (file, response) {
                console.log(response);
                if (response.body) {
                    $scope.startup.picture = response.body;
                }
            },
            dropzoneConfig: {
                paramName: "file",
                url: CONFIG.baseUrl + "/startup/upload-picture",
                parallelUploads: 1,
                maxFileSize: 10,
                dictDefaultMessage: "Cliquez ou Glissez une image pour l'ajouter",
                acceptedFiles: 'image/*',
                headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')}
            }
        };

        $scope.filesZone = {
            addedFile: function (file) {
                $log.log(file);
            },

            error: function (file, errorMessage) {
                $log.log(errorMessage);
            },
            success: function (file, response) {

            },
            dropzoneConfig: {
                url: CONFIG.baseUrl + "/startup/upload-file",
                paramName: "file",
                parallelUploads: 4,
                maxFileSize: 10,
                dictDefaultMessage: 'Cliquez ou Glissez des fichiers pour les rajouter',
                acceptedFiles: 'image/*,application/pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip',
                addRemoveLinks: true,
                maxFiles: 5,
                headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')},
                init: function () {
                    console.log('initializing dropzone');
                    var thisDropzone = this;
                    console.log($scope.startup);
                    if ($scope.startup._id) {
                        $timeout(function () {
                            for (var i in $scope.startup.documents) {
                                var value = $scope.startup.documents[i];
                                var mockFile = {name: value.name, size: value.size};
                                thisDropzone.options.addedfile.call(thisDropzone, mockFile);

                                if (value.file) {
                                    thisDropzone.options.thumbnail.call(thisDropzone, mockFile, value.file);
                                }
                            }
                        }, 1000);
                    }
                }
            }
        };

        console.log($stateParams);
        // IF we are editing a startup
        if ($stateParams._id) {

            $scope.startup._id = $stateParams._id;
            // Load the startup
            $scope.startup = new Startup($scope.startup);
            $scope.startup.$get().then(function (res) {
                    if (res.creationDate) {
                        var d = res.creationDate.split('-');
                        if (res.creationDate.length >= 3) {

                            $scope.creationDate = {
                                day: d[0],
                                month: d[1],
                                year: d[2]
                            };
                        }
                    }
                }
            )
            ;

            // Load the contacts
            $scope.startupContacts = StartupContact.query({'query[startupId]': $scope.startup._id});
        }
        else {
            var draft = $localstorage.getObject('startupDraft');
            if (draft && draft._id) {
                $ngBootbox.confirm("Nous avons sauvegardé une fiche que vous étiez entrain de remplir (<strong>" + draft.name + "</strong>)<br/>" +
                "souhaitez vous la reprendre ?").then(function () {
                    console.log('startup/' + draft._id + '/edit');
                    $location.path('startup/' + draft._id + '/edit');

                });
            }
        }


        //CHECK IF THE STARTUP YOU ARE TRYING TO CREATE DOES NOT ALREADY EXISTS
        $scope.checkExistingStartup = function (name) {
            if (!$scope.startup._id) {
                Startup.query({'check': name}).$promise.then(function (res) {
                    if (res && res.length > 0) {
                        var tpl = "Nous avons trouvé des startups qui ressemblent à la startup que vous souhaiter créer. Peut-être souhaitez-vous editer une de ces fiches à la place ? <hr/>"
                            + res.map(function (e) {
                                return "<div><h3><a href='#/startup/" + e._id + "/edit'>" + e.startupName +
                                (e.picture && e.picture.length > 0 ? "<img class='media-object pull-right' alt='" + e.startupName + "' style='height: 50px; width: 50px;' src='" + e.picture + "' alt=''>" : "" ) +
                                "</a></h3></div>";
                            }).join('<br/>') + "";

                        $ngBootbox.customDialog({
                            message: tpl,
                            title: "Fiches similaires",
                            buttons: {
                                success: {
                                    label: "Fermer",
                                    className: "btn-primary"
                                }
                            }
                        });
                    }
                });
            }
            else {
                $scope.saveStartup();
            }
        };

        var checkRequiredFields = function () {
            var requiredFields = [
                {field: 'startupName', label: 'Nom de la startup'},
                {field: 'tagline', label: 'Tag line de la startup'},
                {field: 'websiteUrl', label: 'Url du site'},
                {field: 'projectTweet', label: 'Le résumé en 140 caractères'}
            ];
            var missingFields = [];
            for (var i in requiredFields) {
                if (!$scope.startup[requiredFields[i].field] || $scope.startup[requiredFields[i].field].length < 1) {
                    missingFields.push(requiredFields[i]);
                }
            }
            if (missingFields.length > 0) {
                $ngBootbox.alert('<h3>Il manque des champs pour valider votre fiche</h3>' + missingFields.map(function (e) {
                    return '<div class="info">' + e.label + '</div>';
                }).join(''));
                return false;
            }
            else {
                return true;
            }

        };
        $scope.openStartup = function (id) {
            console.log('contact' + id);
            $location.path('/startup/' + id + '/edit');
        };

        //SAVE EDITED STARTUP PROGRESS
        $scope.saveStartup = function (value) {
            if (!$scope.startup._id) {
                $scope.startup = new Startup($scope.startup);
                $scope.startup.createdBy = $rootScope.globals.user._id;
                $scope.startup.status = 'draft';
                $scope.startup.$save().then(function (data) {
                    $scope.startup._id = data._id;
                });
            }
            else {
                if ($scope.creationDate && ($scope.creationDate.day || $scope.creationDate.month || $scope.creationDate.year)) {
                    $scope.startup.creationDate = $scope.creationDate.day + '-' + $scope.creationDate.month + '-' + $scope.creationDate.year;
                }
                if ($scope.startup.videoPresentation) {
                    console.log($scope.startup);
                    $scope.startup.youtubeId =
                        Utils.getYoutubeIds($scope.startup.videoPresentation)[1];
                }
                $scope.startup.$update();
                if ($scope.startup.status != 'published') {
                    $localstorage.setObject('startupDraft', {
                        _id: $scope.startup._id,
                        name: $scope.startup.startupName
                    });
                }

            }

        };

        // CHANGE THE STATUS OF THE STARTUP TO PUBLISHED, MAKING IT AVAILABLE TO EVERYONE
        $scope.publishStartup = function () {
            if ($scope.startup._id && checkRequiredFields()) {
                $scope.startup.status = 'published';
                $scope.startup.publishedAt = new Date();
                $scope.startup.$update().then(function (res) {
                    $location.path('/startup/' + $scope.startup._id + '/view');
                })
                $localstorage.remove('startupDraft');
                NotificationService.startupPublished({startupId: $scope.startup._id});
            }

        };

        $scope.crawlMeta = function (url) {

            if (url && url.length > 0) {
                if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
                    url = 'http://' + url;
                }
                if (Utils.validateUrl(url)) {
                    $scope.isAutocompleting = true;
                    try {
                        Crawler.meta({url: url}).$promise.then(function (meta) {
                            console.log(meta);
                            if (!$scope.startup.projectTweet || $scope.startup.projectTweet.length < 1) {
                                $scope.startup.projectTweet = meta.result.summary;
                            }

                            if (!$scope.startup.tagline || $scope.startup.tagline.length < 1) {
                                $scope.startup.tagline = meta.result.title;
                            }

                            if (!$scope.startup.picture || $scope.startup.picture.length < 1) {
                                if (meta.result.image) {
                                    var img = meta.result.image;
                                    if (img.indexOf('http') === -1) {
                                        img = meta.links.base + '/' + img;
                                    }
                                }
                                //  $scope.startup.picture = img;
                            }
                            $scope.isAutocompleting = false;
                            $scope.saveStartup($scope.startup.websiteUrl);
                        });
                    }
                    catch (e) {
                        console.log(e);
                        $scope.isAutocompleting = false;
                    }
                }
            }
        };


        $scope.saveContact = function () {
            // if($scope.newContact._id && $scope.newContact._id !== ''){}
            $scope.newContact.startupId = $scope.startup._id;
            $scope.newContact = new StartupContact($scope.newContact);
            $scope.newContact.$save().then(function (data) {
                $scope.newContact._id = data._id;
                $scope.startupContacts.push($scope.newContact);
                $scope.newContact = {};
            });
        };

        $scope.deleteContact = function (id) {
            var c = $scope.startupContacts.splice(id, 1);
            StartupContact.delete({_id: c[0]._id});
        }

        $scope.addMember = function () {
            console.log('adding member');
            // if($scope.newContact._id && $scope.newContact._id !== ''){}
            if (!$scope.startup.members) {
                $scope.startup.members = [];
            }
            $scope.startup.members.push($scope.newMember);
            $scope.newMember = {};
            $scope.startup.$update();
        };


        $scope.deleteMember = function (id) {
            var c = $scope.startup.members.splice(id, 1);
            $scope.startup.$update();
        }

    }
)
;
