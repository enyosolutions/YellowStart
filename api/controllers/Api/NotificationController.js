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


        Monk.get('startup').find({_id: req.query.startupId}).then(function (startups) {
                if (startups && startups.length > 0) {
                    var startup = startups[0];
                    var notifCollection = Monk.get("user-notification");
                    var notification = {
                        label: "Demande d'analyse de startup : " + startup.startupName,
                        url: '#/startup/' + startup._id + '/view',
                        status: 'new',
                        createdAt: new Date()
                    };

                    Monk.get("user").find({roles: 'ADMIN'}).then(function (coll) {
                        if (coll && coll.length > 0) {
                            for (var i in coll) {
                                MailService.sendAnalysisRequested(coll[i].email, {
                                    user: coll[i],
                                    fromUser: req.query.fromEmail,
                                    startupName: startup.startupName
                                });
                            }
                        }
                    })
                    ;

                }
                return resp.json({});
            }
        )
        ;
    },
    newComment: function (req, resp) {
        console.log('new comment ' + req.query.startupId);
        if (req.query.startupId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        NotificationService.sendNewComment(req.query.startupId);
        return resp.json({});
    },
    clear: function (req, resp) {
        console.log('new comment ' + req.query.userId);
        if (req.query.userId === undefined) {
            return resp.json({error: 'There was an error, no search parameters are provided'})
        }
        Monk.get("user-notification").remove({userId: req.query.userId}).then(function (err) {
            console.log(err);
            return resp.json({});
        });

    }
};

