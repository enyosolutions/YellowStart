/**
 * Api/CrawlerController
 *
 * @description :: Server-side logic for managing api/crawlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
// UPLOAD OF STARTUP MAIN PICTURE
    'upload-picture': function (req, res) {
        var gm = require('gm').subClass({imageMagick: true});
        console.log('upload admin picture');

        req.file('file').upload({
            // don't allow the total upload size to exceed ~10MB
            maxBytes: 10000000,
            dirname: sails.config.appPath + '/assets/data/slideshow'
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
            var original = '/data/slideshow/' + filename;

            res.json(200, {body: original});


            /*
             startup.picture = '/data/home/images/thumb-' + filename;
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
             */

        });

    }
};

