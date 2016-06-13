/**
 * RoutesController
 *
 * @description :: Server-side logic for managing routes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    'list': function (req, res, next) {

        console.log('STARTUP BOOKMARK LIST');

        var out = {};
        var query = {};
        var options = {$limit: 30};
        var userId = "";
        // Query preparation

        query = {bookmarkedBy: userId};
        console.dir('startup bookmarks list', q, JSON.stringify(query, false, null));

        console.log(query);
        var startupCollection = Monk.get('startup');
        startupCollection.find(query).then(function (col) {
            console.log(col.length);
            if (col && col.length > 0) {
                res.json({body: col});
            }
            else {
                console.log('Startup not found');
                res.json(404, {error: 'Startup not found'});
            }
        });

    },
    post: function (req, resp) {
        var userId = "";
        var startupId = req.param('startupId');
        var startupCollection = Monk.get('startup');

        startupCollection.find({_id: startupId})
            .on('success', function (data) {
                if (data) {
                    var original = data[0];
                    startupCollection.update({_id: data._id}, {bookmarkedBy: {$push: userId}})
                        .on('success', function (d) {
                            data.statusCode = 200;
                            resp.json(data.statusCode, {body: data});
                        }).
                        on("error", function (err) {
                            resp.json(500, {error: err});
                        });
                }
                else {
                    res.json(404, {statusCode: 404, status: 'Not Found'});
                }
            })
            .on("error", function (err) {
                resp.json(500, {error: err});
            });
    },
    delete: function (req, resp) {
        var userId = "";
        var startupId = req.param('startupId');

        var startupCollection = Monk.get('startup');
        startupCollection.find({_id: startupId})
            .on('success', function (data) {
                if (data) {
                    var original = data[0];
                    startupCollection.update({_id: data._id}, {bookmarkedBy: {$pop: userId}})
                        .on('success', function (d) {
                            data.statusCode = 200;
                            resp.json(data.statusCode, {body: data});
                        }).
                        on("error", function (err) {
                            resp.json(500, {error: err});
                        });
                }
                else {
                    res.json(404, {statusCode: 404, status: 'Not Found'});
                }
            })
            .on("error", function (err) {
                resp.json(500, {error: err});
            });
    }
};

