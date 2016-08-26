/**
 * Api/CrawlerController
 *
 * @description :: Server-side logic for managing api/crawlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    autocomplete: function (req, resp) {
        console.log(req.query.q);
        if (req.query.q === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }

        var startupCollection = Monk.get('startup');
        var tagCollection = Monk.get('tag');
        var results = [];
        var tag = req.query.q.replace(/#/g,'').replace(/\-/g,'\\-');

        console.log(tag);
        tagCollection.find({label: {$regex: tag, $options: 'i'}}, {limit: 10}).success(function (col) {
            if (col && col.length > 0) {
                results = col.map(function (e) {
                    return {label: '#' + e.label, type: 'tag', subLabel:'',  id: e._id};
                });
            }

            startupCollection.find({
                status: 'published',
                startupName: {$regex: req.query.q, $options: 'i'}
            }, {limit: 10}).success(function (col2) {
                if (col2 && col2.length > 0) {
                    results = results.concat(col2.map(function (e) {
                        var out = {label: e.startupName, id: e._id, type: 'startup'};
                        if(e && e.tags){
                            out.subLabel =  e.tags.map(function(t){return '#' + t;}).join(' ');
                        }
                        return out;
                    }));
                }
                resp.json({body: results});
            }).error(function (err) {
                resp.json({body: results});
            });

        }).error(function (err) {
            resp.json({error: err});
        });
    },

    meta: function (req, resp) {
        if (req.query === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        var url = req.query.url;
        console.log("*******");
        console.log("*******");
        console.log("*******");
        console.log(url);
        if (!url || url === "") {
            return resp.json({});
        }
        url = url.trim();
        var endChar = url.substr(url.length - 1);
        if (['/', '?'].indexOf(endChar) !== -1) {
            url = url.substr(0, url.length - 1);
        }


        if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
            var atob = require('atob');
            url = atob(url);
            console.log(url);
            if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
                return resp.json({error: 'not.an.url'});
            }
        }
        var hash = Utils.md5(url);
        var metaCollection = Monk.get('crawler_meta');
        metaCollection.find({hash: hash}).then(function (doc) {
            if (doc && doc[0] && doc[0].data) {
                return resp.json({body: doc[0].data});
            }
            else {
                try {
                    var htmlcarve = require("htmlcarve");
                    console.time('htmlCarve');
                    htmlcarve.fromUrl(url, function (error, data) {
                        console.timeEnd('htmlCarve');
                        /*
                         if (!error) {
                         Redis.db.set(hash, JSON.stringify(data));
                         Redis.db.expire(hash, 72000); //20h
                         }
                         */
                        metaCollection.insert({hash: hash, url: url, data: data});
                        return resp.json({body: data});
                    });
                }
                catch (e) {
                    console.log(e);
                    return resp.json({});
                }
            }
        });

        return;


        //Todo strip trailing slash
        var hash = Redis.md5(url);
        console.log(url);
        Redis.db.get(hash).then(function (value) {
            var data;
            if (value) {
                data = JSON.parse(value);
                return resp.json(
                    data
                );
            } else {

                try {
                    var htmlcarve = require("htmlcarve");
                    htmlcarve.fromUrl(url, function (error, data) {
                        console.log(error, data);
                        if (!error) {
                            Redis.db.set(hash, JSON.stringify(data));
                            Redis.db.expire(hash, 72000); //20h
                        }
                        return resp.json(
                            data
                        );
                    });
                }
                catch (e) {
                    console.log(e);
                    return resp.json({});

                }
            }


        });
    },
    google: function (req, res) {

        if (req.query.q) {
            var Scraper = require('google-scraper');

            var options = {
                keyword: req.query.q,
                language: "fr",
                results: 100
            };

            const scrape = new Scraper.GoogleScraper(options);
            scrape.getGoogleLinks.then(function (value) {
                return res.view({'urls': value, q: req.query.q});
            }).catch(function (e) {
                console.log(e);
            })


        }
        else {
            return res.view({'urls': []});
        }

    },
    tags: function (req, res) {
        Monk.get('startup').col.aggregate([
                {$project: {tags: 1}},
                {$unwind: "$tags"},
                {
                    $group: {
                        _id: "$tags",
                        weight: {$sum: 1}
                    }
                }

            ], {}, function (err, results) {
                var output = [];
                if (results.length > 0) {
                    output = results.map(function (e) {
                        return {text: e._id, weight: e.weight};
                    });
                }
                res.json({body: output});
            }
        );
    }

};

