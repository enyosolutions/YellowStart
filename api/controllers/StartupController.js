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
        var options = {$limit: 30};

        console.log(req.query);
        // Query preparation
        if (req.query) {
            if (req.query.query) {
                query = req.query.query;

            }
            else if (req.query.tag) {
                var q = req.query.tag;
                query = {tags: q};
                console.dir('startup tag', q, JSON.stringify(query, false, null));
            }
            else if (req.query.search) {
                var q = req.query.search;
                query = {$or: [{startupName: {$regex: q, $options: 'i'}}, {websiteUrl: {$regex: q, $options: 'i'}}, {tags: {$regex: q, $options: 'i'}}]};
                console.dir('startup search', q, JSON.stringify(query, false, null));
            }
            else if (req.query.ids) {
                if(!req.query.ids instanceof String){
                    req.query.ids = [req.query.ids];
                }
                query = {$or: req.query.ids.map(function(o){return  {_id: o};}) };
                console.dir('startup search', q, JSON.stringify(query, false, null));
            }

            if (req.query.sort) {
                options['sort'] = {};
                for(var i in req.query.sort){
                    options['sort'][i] = parseInt(req.query.sort[i]);
                }

            }
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
        console.log(query, options);
        var startupCollection = Monk.get('startup');
        startupCollection.find(query, options).success(function (col) {
            if (col && col.length > 0) {
                res.json({body: col});
            }
            else {
                console.log('Startup not found');
                res.json(404, {error: 'Startup not found'});
            }
        })
            .error(function(err){
                console.log('Startup not found',err);
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

        console.log('upload files');

        var id = req.body._id;
        var fileId = req.body.fileId;
        console.log('startup id', id);
        console.log('startup id', file);
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
                    console.log(uploadedFiles[0]);
                    var filename = uploadedFiles[0].fd.split('/').pop();
                    console.log(filename);
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

