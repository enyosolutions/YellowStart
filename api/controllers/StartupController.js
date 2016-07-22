/**
 * StartupController
 *
 * @description :: Server-side logic for managing startups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    'list': function (req, res, next) {

        var out = {};
        var query = {};
        var startPage = req.query.page != undefined ? req.query.page : 0;
        var status = req.query.status ? req.query.status : undefined;
        var options = {limit: req.query.limit ? req.query.limit : 12, skip: startPage * 4};


        // Query preparation
        if (req.query) {
            if (req.query.query) {
                query = req.query.query;
            }
            else if (req.query.tag) {
                var q = req.query.tag;
                query = {tags: q};
            }
            else if (req.query.check) {
                var q = req.query.check;
                query = {startupName: {$regex: '^' + q, $options: 'i'}};
            }
            else if (req.query.search) {
                var q = req.query.search;
                query = {
                    $or: [{startupName: {$regex: q, $options: 'i'}}, {
                        websiteUrl: {
                            $regex: q,
                            $options: 'i'
                        }
                    }, {tags: {$regex: q, $options: 'i'}}]
                };
            }
            else if (req.query.related) {
                var q = req.query.related;
                var startupCollection = Monk.get('startup');
                console.log('RElated startup', q);
                startupCollection.findOne({_id: q}).on('success', function (col) {
                    if (col) {
                        if (col.tags && col.tags.length > 0) {
                            var maxId = col.tags.length;
                            var tagId = Math.floor(Math.random() * (maxId - 0));
                            query = {
                                tags: col.tags[tagId]
                            };
                        }
                        else if (col.mainTag && col.mainTag.length) {
                            query = {
                                tags: col.mainTag
                            };
                        }
                        else {
                            var randId = Math.floor(Math.random() * (5 - 0));
                            query = {
                                tags: {$regex: ['a', 'b', 'c', 'e', 't'][randId]}
                            };
                        }
                    }
                    console.log('RElated startup', query);
                });
            }
            else if (req.query.ids) {
                if (!req.query.ids instanceof String) {
                    req.query.ids = [req.query.ids];
                }
                query = {
                    $or: req.query.ids.map(function (o) {
                        return {_id: o};
                    })
                };
            }

            if (req.query.publishedOnly) {
                query.status = 'published';
            }
            if (req.query.sort) {
                options['sort'] = {};
                for (var i in req.query.sort) {
                    options['sort'][i] = parseInt(req.query.sort[i]);
                }

            }
        }

        if (status) {
            query.status = status;
        }
        /*
         Monk.get(req.param('endpoint')).find(query, options)
         .on('success', function (data) {
         data.statusCode = 200;
         resp.json({body: data});
         })
         .on('error', function (err) {
         resp.json(500, {error: err});
         });
         */

        console.log('*****QUERY : ', query);
        var startupCollection = Monk.get('startup');
        startupCollection.find(query, options).success(function (col) {
            if (col && col.length > 0) {
                res.json({body: col});
            }
            else {
                console.log('No results', query, options);
                res.json(404, {body: []});
            }
        })
            .error(function (err) {
                console.log('ERROR WHILE SEARCHING', err);
                res.json(404, {error: 'Startup not found'});
            });

    },

    'listComments': function (req, resp) {

        var out = {};
        var query = {};
        var startPage = req.query.page != undefined ? req.query.page : 0;
        var skip = req.query.skip ? req.query.skip : 20;
        var options = {limit: skip, skip: startPage * skip};
        if (req.query) {
            if (req.query.query) {
                query = req.query.query;
            }
            if (req.query.sort) {
                options['sort'] = options.sort;
            }
        }
        var collection = Monk.get('startup-comment');
        collection.find(query, options)
            .on('success', function (data) {
                console.log(data);
                var userIds = data.map(function (e) {
                    return new Object(e.userId);
                });
                console.log(userIds);
                Monk.get('user').find({_id: {$in: userIds}}).success(function (users) {
                    var userObj = {};
                    for (var i in users) {
                        userObj[users[i]._id + ""] = users[i];
                    }
                    data = data.map(function (e) {
                        e.user = userObj[e.userId];
                    });
                    data.statusCode = 200;
                    resp.json({body: data});
                }).on('error', function (err) {
                    resp.json({body: data});
                });
            })
            .on('error', function (err) {
                resp.json(500, {error: err});
            });
    },

    lunaActions: function (req, res, next) {
        // MailService.sendActivitySummary();
        console.log('luna actions');
        var request = require('request');
        var startupColl = Monk.get('startup');
        var lunaStartupColl = Monk.get('luna-startup');
        var startupContactColl = Monk.get('startup-contact');
        if (req.query.dlStartups) {
            request('http://luna.startinpost.com/project/apilisttititata', function (error, response, body) {
                if (error) {
                    res.json({error: error});
                }
                else {
                    var content = JSON.parse(body);
                    for (var i in content) {
                        var oldStartup = content[i];

                        lunaStartupColl.update({id: oldStartup.id}, oldStartup, {upsert: true}).error(function (err) {
                            console.log(err);
                        });
                    }
                    res.json({body: content.length});
                }
            });
        }
        else if (req.query.import) {
            var query = req.query.import === 'all' ? {} : {_id: req.query.import};

            console.log('Luna update', query);
            var startupCache = {};
            lunaStartupColl.find(query).then(function (coll) {
                console.log('NUMBER OF LUNA STARTUP ', coll.length);
                if (coll && coll.length > 0) {
                    console.log('NUMBER OF LUNA STARTUP ', coll.length);
                    for (var i in coll) {

                        var oldStartup = coll[i];
                        startupCache[oldStartup.id] = coll[i];
                        console.log(oldStartup.id, oldStartup.StartupName, oldStartup.ContactFirstName, oldStartup.ContactLastName, oldStartup.ContactEmail);
                        var newStartup = {
                            lunaId: oldStartup.id,
                            "startupName": oldStartup.StartupName,
                            "tagline": oldStartup.Innovation,
                            "status": oldStartup.status,
                            "websiteUrl": oldStartup.WebsiteUrl,
                            "projectTweet": oldStartup.ProjectTweet,
                            "tagline": oldStartup.Tagline,
                            "creationDate": oldStartup.CreationDate,
                            "offerDetails": oldStartup.OfferDetails,
                            "offerBusiness": oldStartup.OfferBusiness,
                            "offerPositionning": oldStartup.OfferPositionning,
                            "offerStrengths": oldStartup.OfferStrengths,
                            "offerDiff": oldStartup.OfferDiff,
                            "offerWeaknesses": oldStartup.OfferWeaknesses,
                            "marketDescription": oldStartup.MarketDescription,
                            "marketClients": oldStartup.MarketClients,
                            "marketCompetitors": oldStartup.MarketCompetitors,
                            "revenues": oldStartup.Revenues,

                            "otherRevenues": oldStartup.OtherRevenues,
                            "funds": oldStartup.Funds,
                            "raisedFunds": oldStartup.RaisedFunds,
                            "sipAnalysis": oldStartup.SipAnalysis,
                            "offerServices": oldStartup.OfferServices,
                            funds: oldStartup.Funds,
                            createdAt: new Date(),
                            lastModifiedAt: new Date(oldStartup.modified_at)
                        };


                        //startupColl.findAndModify({lunaId: oldStartup.id}, newStartup, {
                        startupColl.findAndModify({lunaId: oldStartup.id}, {
                                $set: {
                                    lastModifiedAt: new Date(),
                                    lunaId: oldStartup.id
                                }
                            }, {
                                upsert: false,
                                new: false
                            }, function (err, start) {
                                if (start && start.value && start.value._id) {
                                    var _id = start.value._id + '';
                                    start = start.value;
                                    console.log('count', _id, startupCache[start.lunaId].StartupName, startupCache[start.lunaId].ContactEmail);
                                    var lunStartup = startupCache[start.lunaId];
                                    console.log('NEW STARTUP', start.startupName, lunStartup.ContactEmail, start.createdAt);
                                    if (lunStartup) {
                                        startupContactColl.update({
                                                startupId: _id,
                                                email: lunStartup.ContactEmail
                                            },
                                            {
                                                startupId: _id,
                                                firstname: lunStartup.ContactFirstName,
                                                lastname: lunStartup.ContactLastName,
                                                email: lunStartup.ContactEmail,
                                                phonenumber: lunStartup.ContactTel
                                            }, {upsert: true, new: true, multi: false}).then(function (err) {
                                                startupCache[start.lunaId] = null;
                                            });
                                    }
                                }
                            },
                            function (err) {
                                if(err.result)
                                console.log(err.result);
                            }
                        );
                    }
                }
                res.json({});
            });

        }
        else {
            res.json({error: 'NO ACTION SPECIFIED'});
        }
    },

    // UPLOAD OF STARTUP DOCUMENTS
    'uploadFile': function (req, res, next) {

        console.log('upload files');

        var id = req.body._id;
        console.log('startup id', id);
        var startupCollection = Monk.get('startup');
        startupCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var startup = col[0];
                req.file('file').upload({
                    // don't allow the total upload size to exceed ~10MB
                    maxBytes: 10000000,
                    dirname: sails.config.appPath + '/assets/data/startup/documents'
                }, function whenDone(err, uploadedFiles) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }

                    // Save the "fd" and the url where the avatar for a user can be accessed
                    var filename = uploadedFiles[0].fd.split('/').pop();
                    console.log(uploadedFiles[0]);
                    if (!startup.documents) {
                        startup.documents = [];
                    }

                    startup.documents.push({
                        id: filename,
                        size: uploadedFiles[0].size,
                        type: uploadedFiles[0].type,
                        extension: uploadedFiles[0].filename.split('.').pop(),
                        name: uploadedFiles[0].filename,
                        file: '/data/startup/documents/' + filename
                    });
                    startupCollection.update({_id: id}, startup).then(function () {
                        res.json(200, {body: startup.documents});
                    });
                });
            }
            else {
                console.log('Startup not found');
                res.json(404, {error: 'Startup not found'});
            }
        });

    },

    // UPLOAD OF STARTUP PRODUCT PICTURES
    'uploadImages': function (req, res, next) {

        console.log('upload Images');

        var id = req.body._id;
        console.log('startup id', id);
        var startupCollection = Monk.get('startup');
        startupCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var startup = col[0];
                req.file('file').upload({
                    // don't allow the total upload size to exceed ~10MB

                    maxBytes: 10000000,
                    dirname: sails.config.appPath + '/assets/data/startup/images'
                }, function whenDone(err, uploadedFiles) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }

                    // Save the "fd" and the url where the avatar for a user can be accessed
                    var filename = uploadedFiles[0].fd.split('/').pop();
                    console.log(uploadedFiles[0]);
                    if (!startup.images) {
                        startup.images = [];
                    }

                    startup.images.push({
                        id: filename,
                        size: uploadedFiles[0].size,
                        type: uploadedFiles[0].type,
                        extension: uploadedFiles[0].filename.split('.').pop(),
                        name: uploadedFiles[0].filename,
                        file: '/data/startup/images/' + filename
                    });
                    startupCollection.update({_id: id}, startup).then(function () {
                        res.json(200, {body: startup.images});
                    });
                });
            }
            else {
                console.log('Startup not found');
                res.json(404, {error: 'Startup not found'});
            }
        });

    },


    'deleteFile': function (req, res, next) {

        var id = req.body ? req.body._id : null;
        var fileId = req.body.fileId;

        var startupCollection = Monk.get('startup');
        startupCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var startup = col[0];
                isDoc = false;
                for (var i = 0; i < startup.documents.length; i++) {

                    if (startup.documents[i].file === fileId) {
                        startup.documents.splice(i, 1);
                        isDoc = true;
                        break;
                    }
                }
                if (!isDoc) {
                    for (var i = 0; i < startup.images.length; i++) {
                        if (startup.images[i].file === fileId) {
                            startup.images.splice(i, 1);
                            break;
                        }
                    }
                }

                startupCollection.update({_id: id}, startup).then(function () {
                    res.json(200, {body: startup});
                });
            }
            else {
                console.log('Startup not found');
                res.json(404, {error: 'Startup not found'});
            }
        });

    },
    // UPLOAD OF STARTUP MAIN PICTURE
    'uploadPicture': function (req, res) {
        var gm = require('gm').subClass({imageMagick: true});
        console.log('upload picture');

        var id = req.body._id;
        var startupCollection = Monk.get('startup');
        console.log(id);
        startupCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var startup = col[0];
                req.file('file').upload({
                    // don't allow the total upload size to exceed ~10MB
                    maxBytes: 10000000,
                    dirname: sails.config.appPath + '/assets/data/startup/images'
                }, function whenDone(err, uploadedFiles) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }


                    // Save the "fd" and the url where the avatar for a user can be accessed
                    var filename = uploadedFiles[0].fd.split('/').pop();
                    console.log(process.cwd());
                    var original = '/data/startup/images/' + filename;
                    startup.picture = '/data/startup/images/thumb-' + filename;
                    console.log(process.cwd() + '/assets' + original);
                    gm(process.cwd() + '/assets' + original)
                        .resize('500', '333', '^')
                        .gravity('Center')
                        .crop('500', '333')
                        .write(process.cwd() + '/assets'
                        + startup.picture, function (err) {
                            console.log(err);
                            console.log('Image cropped');
                            startupCollection.update({_id: id}, startup).then(function () {
                                res.json(200, {body: startup.picture});
                            });
                        });

                });
            }
            else {
                res.json(404, {error: 'Startup not found'});
            }
        });
    },

    // UPLOAD OF STARTUP MAIN PICTURE
    'uploadLogo': function (req, res) {
        var gm = require('gm').subClass({imageMagick: true});
        console.log('upload picture');

        var id = req.body._id;
        var startupCollection = Monk.get('startup');
        console.log(id);
        startupCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var startup = col[0];
                req.file('file').upload({
                    // don't allow the total upload size to exceed ~10MB
                    maxBytes: 10000000,
                    dirname: sails.config.appPath + '/assets/data/startup/logos'
                }, function whenDone(err, uploadedFiles) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    // If no files were uploaded, respond with an error.
                    if (uploadedFiles.length === 0) {
                        return res.badRequest('No file was uploaded');
                    }


                    // Save the "fd" and the url where the avatar for a user can be accessed
                    var filename = uploadedFiles[0].fd.split('/').pop();
                    console.log(process.cwd());
                    startup.logo = '/data/startup/logos/' + filename;

                    startupCollection.update({_id: id}, startup).then(function () {
                        res.json(200, {body: startup.logo});
                    });

                });
            }
            else {
                res.json(404, {error: 'Startup not found'});
            }
        });
    }
}
;

