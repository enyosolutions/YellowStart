/**
 * Api/CrawlerController
 *
 * @description :: Server-side logic for managing api/crawlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    startupPublished: function (req, resp) {
        if (req.query.startupId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        NotificationService.sendStartupPublished(req.query.startupId);
        return resp.json({});
    },
    newComment: function (req, resp) {
        console.log('new comment '  + req.query.startupId);
        if (req.query.startupId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        NotificationService.sendNewComment(req.query.startupId);
        return resp.json({});
    },
    clear: function (req, resp) {
        console.log('new comment '  + req.query.startupId);
        if (req.query.startupId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        Monk.get("user-notification").remove({startupId: req.query.startupId}).then(function(){
            return resp.json({});
        });

    }
};

