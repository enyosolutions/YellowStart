/**
 * Api/CrawlerController
 *
 * @description :: Server-side logic for managing api/crawlers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    accountActivated: function (req, resp) {
        if (req.query.userId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }

        var userCollection = Monk.get('user');
        userCollection.find({_id: req.query.userId}).then(function (users) {
            if (users && users.length > 0) {
                var user = users[0];
                MailService.sendAccountActivated(user.email, {user: user});
            }
            return resp.json({});
        });


    },
    startupPublished: function (req, resp) {
        if (req.query.startupId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        NotificationService.sendStartupPublished(req.query.startupId);
        return resp.json({});
    },
    requestAnalysis: function (req, resp) {
        if (req.query.startupId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        NotificationService.sendRequestAnalysis(req.query.startupId);
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
        console.log('new comment '  + req.query.userId);
        if (req.query.userId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        Monk.get("user-notification").remove({userId: req.query.userId}).then(function(err){
            console.log(err);
            return resp.json({});
        });

    }
};

