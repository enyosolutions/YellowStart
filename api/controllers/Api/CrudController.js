/**
 * Api/CrudController
 *
 * @description :: Server-side logic for managing api/crawlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var extend = require('extend');

module.exports = {

    list: function (req, resp) {
        var out = {};
        var query = {};
        var options = {$limit:30};
        if(req.query){
            if( req.query.query){
            query =  req.query.query;
            }
            if(req.query.sort){
                options['$sort'] = options.sort;
            }
        }
        Monk.get(req.param('endpoint')).find(query, options)
            .on('success', function (data) {
                data.statusCode = 200;
                resp.json({body: data});
            })
            .on('error', function (err) {
                resp.json(500, {error: err});
            });
    },
    get: function (req, resp) {
        Monk.get(req.param('endpoint')).find({_id: req.param('id')})
            .on('success', function (data) {
                data[0].statusCode = 200;
                resp.json(data[0]);
                var id = req.token ? req.token.id : 'ANONYMOUS';
                Monk.get('access-logs').insert({userId: id, itemId: req.param('id'), itemCollection: req.param('endpoint'), action: 'view'});
            })
            .on("error", function (err) {
                resp.json(500, {error: err});
            });
    },
    post: function (req, resp) {
        var data = extend({createdAt: new Date()}, req.body);
        console.log(data, req.param('endpoint'));
        Monk.get(req.param('endpoint')).insert(data)
            .on('success', function (d) {
                resp.json({body:d });
                var id = req.token ? req.token.id : 'ANONYMOUS';

                Monk.get('access-logs').insert({userId: id, itemId: req.param('id'), itemCollection: req.param('endpoint'), action: 'create'});
            })
            .on("error", function (err,err2) {
                console.log(err, err2);
                resp.json(500, {error: [err, err2]});
            });
    },
    put: function (req, resp) {
        Monk.get(req.param('endpoint')).find({_id: req.param('id')})
            .on('success', function (data) {
                if (data) {
                    var collection = Monk.get(req.param('endpoint'));
                    var original = data[0];
                    var data = extend(true, {}, original, req.body,{lastModifiedAt: new Date()});
                    collection.update({_id: data._id},data)
                        .on('success', function (d) {
                            data.statusCode = 200;
                            resp.json(data.statusCode, {body: data});
                            var id = req.token ? req.token.id : 'ANONYMOUS';
                            Monk.get('access-logs').insert({userId: id, itemId: req.param('id'), itemCollection: req.param('endpoint'), action: 'update'});
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
    patch: function (req, resp) {
        Monk.get(req.param('endpoint')).find({_id: req.param('id')})
            .on('success', function (data) {
                if (data && data[0]) {
                    var collection = Monk.get(req.param('endpoint'));
                    var original = data[0];
                    var data = extend(true, {}, original, req.body, {lastModifiedAt: new Date()});
                    collection.update({_id: data._id},data).then(function (d) {
                        data.statusCode = 200;
                        resp.json(data.statusCode, {body: d});
                        var id = req.token ? req.token.id : 'ANONYMOUS';
                        Monk.get('access-logs').insert({userId: id, itemId: req.param('id'), itemCollection: req.param('endpoint'), action: 'patch'});
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
        Monk.get(req.param('endpoint')).remove({_id: req.param('id')})
            .on('success', function (data) {
                resp.json(200, {});
                var id = req.token ? req.token.id : 'ANONYMOUS';
                Monk.get('access-logs').insert({userId: id, itemId: req.param('id'), itemCollection: req.param('endpoint'), action: 'delete'});
            })
            .on("error", function (err) {
                resp.json(500, {error: err});
            });
    }
};

