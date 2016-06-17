/**
 * StartupController
 *
 * @description :: Server-side logic for managing startups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    'list': function (req, res, next) {

        MailService.sendActivitySummary();
        var out = {};
        var query = {};
        var startPage = req.query.page ? req.query.page : 0;
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
                startupCollection.find({_id: q}).then(function (col) {
                    if (col && col.length > 0) {
                        var maxId = col.tags.length;
                        var tagId = Math.floor(Math.random() * (maxId - 0));
                        query = {
                            tags: col.tags[tagId]
                        };
                    }
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

            if (req.query.sort) {
                options['sort'] = {};
                for (var i in req.query.sort) {
                    options['sort'][i] = parseInt(req.query.sort[i]);
                }

            }
        }

        if(status){
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
            })
        ;

    },
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
                    if (!startup.documents) {
                        startup.documents = [];
                    }
                    startup.documents.push({
                        id: filename,
                        size: uploadedFiles[0].size,
                        type: uploadedFiles[0].type,
                        name: uploadedFiles[0].filename,
                        file: '/data/startup/images/' + filename
                    });
                    console.log(startup);
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
    'deleteFile': function (req, res, next) {

        var id = req.body._id;
        var fileId = req.body.fileId;

        var startupCollection = Monk.get('startup');
        startupCollection.find({_id: id}).then(function (col) {
            console.log(col);
            if (col && col.length > 0) {
                var startup = col[0];
                for (var i = 0; i < startup.documents.length; i++) {
                    if (startup.docuements[i].file === fileId) {
                        startup.documents.splice(i, 1);
                        break;
                    }
                }

                startupCollection.update({_id: id}, startup).then(function () {
                    res.json(200, {body: startup.documents});
                });
            }
            else {
                console.log('Startup not found');
                res.json(404, {error: 'Startup not found'});
            }
        });

    },
    'uploadPicture': function (req, res) {

        console.log('upload picture');

        var id = req.body._id;
        var startupCollection = Monk.get('startup');
        console.log(id);
        startupCollection.find({_id: id}).then(function (col) {
            console.log(col);
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
                    startup.picture = '/data/startup/images/' + filename;
                    startupCollection.update({_id: id}, startup).then(function () {
                        res.json(200, {body: startup.picture});
                    });
                });
            }
            else {
                res.json(404, {error: 'Startup not found'});
            }
        });
    }
};

