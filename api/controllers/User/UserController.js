/**
 * RoutesController
 *
 * @description :: Server-side logic for managing routes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    'list': function (req, res, next) {

        console.log('STARTUP LIST');

        var out = {};
        var query = {};
        var options = {$limit: 30};

        // Query preparation
        if (req.query) {
            if (req.query.query) {
                query = req.query.query;

            }
            else if (req.query.search) {
                var q = req.query.search;
                query = {$or: [{startupName: {$regex: q, $options: 'i'}}, {websiteUrl: {$regex: q, $options: 'i'}}, {tags: {$regex: q, $options: 'i'}}]};
                console.dir('startup search', q, JSON.stringify(query, false, null));
            }
            if (req.query.sort) {
                options['sort'] = {};
                for (var i in req.query.sort) {
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

    }
};
