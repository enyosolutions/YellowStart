'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:EditStartupCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('EditStartupCtrl', function ($scope, $rootScope, $stateParams, $location, $http, $localstorage, $timeout, $ngBootbox, $compile, $log, Startup, StartupContact, Utils, Tag, Crawler, NotificationService, CONFIG) {
        $scope.pageClass = 'startup-edit';
        $scope.pageClass = 'edit-page';
        $scope.startup = {};
        $scope.startupContacts = []; // LIST OF CONTACT OF THE STARTUP
        $scope.newContact = {}; // NEW CONTACT FOR ADDING AND EDITING FORM
        $scope.selectedTags = [];

        // SELECTIZE
        $scope.tagsOptions = Tag.query();


        // IF we are editing a startup
        if ($stateParams._id) {

            $scope.startup._id = $stateParams._id;
            // Load the startup
            $scope.startup = new Startup($scope.startup);
            $scope.startup.$get().then(function (res) {
                    if (res.tags) {
                        $scope.selectedTags = res.tags;
                        if (res.mainTag) {
                            var idx = $scope.selectedTags.indexOf(res.mainTag);
                            if (idx !== -1) {
                                $scope.selectedTags.splice(idx, 1);
                            }

                        }
                    }
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


        //main tag config
        $scope.mainTagChanged = function (value, oldvalue) {
            if (oldvalue) {
                var idx = $scope.startup.tags.indexOf(oldvalue);
                if (idx) {
                    $scope.startup.tags.splice(idx, 1);
                }
            }
            if (!$scope.startup.tags) {
                $scope.startup.tags = [];
            }
            if ($scope.startup.tags.indexOf(value) === -1) {
                $scope.startup.tags.push(value);
            }
            console.log(value);
            $scope.saveStartup();
        };

        $scope.tagsList = {};
        for (var i in $scope.tagsOptions) {
            var tag = $scope.tagsOptions[i];
            $scope.tagsList[tag.slug] = tag;
        }
        //other tag config
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
            onChange: function (values) {
                console.log(values);
                $scope.startup.tags = values.map(slugify);
                if ($scope.startup.tags.indexOf($scope.startup.mainTag) === -1) {
                    $scope.startup.tags.push($scope.startup.mainTag);
                }
                $scope.saveStartup();
            }

        };

        //CONFIG FOR THE LOGO DROP ZONE
        $scope.logoZone = {
            addedFile: function (file) {
                $log.log(file);
            },
            removedFile: function (file) {
                $http.get('/startup/delete-file?id=' + $scope.startup._id + '&fileId=' + file.file);
            },
            error: function (file, errorMessage) {
                $log.log(errorMessage);
            },
            success: function (file, response) {
                console.log(response);
                if (response.body) {
                    $scope.startup.logo = response.body;
                }
            },
            dropzoneConfig: {
                paramName: "file",
                url: CONFIG.baseUrl + "/startup/upload-logo",
                parallelUploads: 1,
                maxFileSize: 10,
                dictDefaultMessage: "Cliquez ou Glissez une image pour ajouter le logo",
                acceptedFiles: 'image/*',
                headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')},
                init: function () {
                    console.log('initializing logo dropzone');
                    var thisDropzone = this;
                    console.log($scope.startup);
                    if ($scope.startup._id && $scope.startup.logo) {
                        $timeout(function () {
                            console.log($scope.startup.logo);
                            var mockFile = {name: $scope.startup.logo, size: 0};
                            thisDropzone.options.addedfile.call(thisDropzone, mockFile);
                            thisDropzone.options.thumbnail.call(thisDropzone, mockFile, $scope.startup.logo);
                        }, 1500);
                    }
                }
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
                    $scope.startup.picture = response.body.picture;
                    $scope.startup.fulPicture = response.body.fullPicture;
                }
            },
            dropzoneConfig: {
                paramName: "file",
                url: CONFIG.baseUrl + "/startup/upload-picture",
                parallelUploads: 1,
                maxFileSize: 10,
                dictDefaultMessage: "Glissez-déposer ou bien cliquez pour ajouter une image",
                acceptedFiles: 'image/*',
                headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')},
                init: function () {
                    console.log('initializing MAIN PICTURE dropzone');
                    var thisDropzone = this;
                    console.log($scope.startup, $scope.startup._id, $scope.startup.picture);
                    $timeout(function () {
                        if ($scope.startup._id && $scope.startup.picture) {
                            console.log($scope.startup.picture);
                            var mockFile = {name: $scope.startup.picture, size: '',};
                            thisDropzone.options.addedfile.call(thisDropzone, mockFile);
                            thisDropzone.options.thumbnail.call(thisDropzone, mockFile, $scope.startup.picture);

                        }
                    }, 1500);
                }
            }
        };

        $scope.filesZone = {
            addedFile: function (file) {
                $log.log(file);
            },
            removedFile: function (file) {
                var thisDropzone = this;
                console.log(file, '/startup/delete-file?id=' + $scope.startup._id + '&fileId=' + file.id);
                $http.post('/startup/delete-file', {_id: $scope.startup._id, fileId: file.id});

                for (var i = 0; i < $scope.startup.documents.length; i++) {
                    if ($scope.startup.documents[i].file === file.id) {
                        $scope.startup.documents.splice(i, 1);
                        break;
                    }
                }

                return true;
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
                dictDefaultMessage: 'Glissez-déposer ou bien cliquez pour ajouter un document',
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
                                var mockFile = {name: value.name, size: value.size, id: value.file};
                                thisDropzone.options.addedfile.call(thisDropzone, mockFile);

                                if (value.file) {
                                    thisDropzone.options.thumbnail.call(thisDropzone, mockFile, value.file);
                                }
                            }
                        }, 1500);
                    }
                }
            }
        };

        $scope.extraImagesZone = {
            addedFile: function (file) {
                $log.log(file);
            },

            removedFile: function (file) {
                var thisDropzone = this;
                console.log(file, '/startup/delete-file?id=' + $scope.startup._id + '&fileId=' + file.id);
                $http.post('/startup/delete-file', {_id: $scope.startup._id, fileId: file.id});
                for (var i = 0; i < $scope.startup.images.length; i++) {
                    if ($scope.startup.images[i].file === file.id) {
                        $scope.startup.images.splice(i, 1);
                        break;
                    }
                }
                return true;
            },

            error: function (file, errorMessage) {
                $log.log(errorMessage);
            },

            success: function (file, response) {

            },
            dropzoneConfig: {
                url: CONFIG.baseUrl + "/startup/upload-images",
                paramName: "file",
                parallelUploads: 4,
                maxFileSize: 10,
                dictDefaultMessage: 'Glissez-déposer ou bien cliquez pour ajouter une image',
                acceptedFiles: 'image/*',
                addRemoveLinks: true,
                maxFiles: 5,
                headers: {'Authorization': 'Bearer ' + $localstorage.get('auth_token')},

                init: function () {
                    console.log('initializing dropzone');
                    var thisDropzone = this;
                    console.log($scope.startup);
                    if ($scope.startup._id) {
                        $timeout(function () {
                            for (var i in $scope.startup.images) {
                                var value = $scope.startup.images[i];
                                var mockFile = {name: value.name, size: value.size, id: value.file};
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


        //CHECK IF THE STARTUP YOU ARE TRYING TO CREATE DOES NOT ALREADY EXISTS
        $scope.checkExistingStartup = function (name) {
            if (!$scope.startup._id) {
                Startup.query({'check': name}).$promise.then(function (res) {
                    if (res && res.length > 0) {
                        var tpl = "Nous avons trouvé des startups qui ressemblent à la startup que vous allez créer. Peut-être souhaitez-vous editer une de ces fiches à la place ? <hr/>"
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
                console.log($scope.startup._id);
                $scope.saveStartup();
            }
        };

        var checkRequiredFields = function () {
            var requiredFields = [
                {field: 'startupName', label: 'Nom de la startup'},
                {field: 'websiteUrl', label: 'Url du site'},
                {field: 'projectTweet', label: 'Le résumé en 140 caractères'},
                {field: 'tags', label: 'Les tags de la startup'}
            ];
            var missingFields = [];
            for (var i in requiredFields) {
                if (!$scope.startup[requiredFields[i].field] || $scope.startup[requiredFields[i].field].length < 1) {
                    missingFields.push(requiredFields[i]);
                }
            }
            console.log(missingFields);
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

                if($scope.startup.analysisRequested && $scope.startup.sipScore != '' && $scope.startup.sipAnalysis != '' ){
                    $scope.startup.analysisRequested = false;
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


        $scope.closeStartup = function () {
            $scope.saveStartup();
            $location.path('/startup/' + $scope.startup._id + '/view');
        };

        // CHANGE THE STATUS OF THE STARTUP TO PUBLISHED, MAKING IT AVAILABLE TO EVERYONE
        $scope.publishStartup = function () {
            console.log($scope.startup._id);
            if ($scope.startup._id && checkRequiredFields()) {
                $scope.startup.status = 'published';
                $scope.startup.publishedAt = new Date();

                 if($scope.startup.analysisRequested && $scope.startup.sipScore != '' && $scope.startup.sipAnalysis != '' ){
                    $scope.startup.analysisRequested = false;
                }

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
