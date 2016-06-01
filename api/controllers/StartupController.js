/**
 * StartupController
 *
 * @description :: Server-side logic for managing startups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    'uploadFiles': function (req, res, next) {

        console.log('upload files');

        var id = req.body._id;
        console.log(id);
        var startupCollection = Monk.get('startup');
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

                    startup.documents.push({
                        size: uploadedFiles[0].fd.size,
                        type: uploadedFiles[0].fd.type,
                        name: uploadedFiles[0].fd.filename,
                        file: '/data/startup/images/' + filename
                    });
                    startupCollection.update({_id: id}, startup).then(function () {
                        res.json(200, {body: startup.documents});
                    });
                });
            }
            else {
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

