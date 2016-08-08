module.exports = {

    sendStartupPublished: function (startupId) {
        Monk.get('startup').find({_id: startupId}).then(function (startups) {
            if (startups && startups.length > 0) {
                var startup = startups[0];
                var notifCollection = Monk.get("user-notification");
                var notification = {
                    label: 'Nouvelle startup publiée : ' + startup.startupName,
                    url: '#/startup/' + startup._id + '/view',
                    status: 'new',
                    type:'startup',
                    createdAt: new Date()
                };

                Monk.get("user").find({bookmarks: startup._id} + '').then(function (coll) {
                    if (coll && coll.length > 0) {
                        for (var i in coll) {
                            notification.userId = coll[i]._id;
                            notifCollection.insert(notification);
                        }
                    }
                });
            }
        });
    },

    sendRequestAnalysis: function (startupId, fromEmail) {
        console.log('analysis service', startupId);
        Monk.get('startup').findOne({_id: startupId}).then(function (startup) {
            if (startup) {
                var notifCollection = Monk.get("user-notification");
                var notification = {
                    label: "Demande d'analyse sur " + startup.startupName,
                    url: '#/startup/' + startup._id + '/view',
                    status: 'new',
                    type: "startup",
                    createdAt: new Date()
                };

                Monk.get("user").find({roles: 'ADMIN'}).then(function (coll) {
                    if (coll && coll.length > 0) {
                        for (var i in coll) {
                            console.log('Envoi des notifs ');
                            console.log('USER', coll[i].firstname);
                            notification.userId = coll[i]._id + "";
                            console.log('NOTIFICATION:', notification);
                            notifCollection.insert(notification);

                            console.log('Envoi des mails ');
                            MailService.sendAnalysisRequested(coll[i].email, {
                                user: coll[i],
                                fromUser: fromEmail,
                                startupName: startup.startupName
                            });
                        }
                    }
                })
                ;

            }
        });
    },

    sendNewComment: function (startupId) {
        var notifCollection = Monk.get("user-notification");
        Monk.get('startup').find({_id: startupId}).then(function (startups) {
            if (startups && startups.length > 0) {
                var startup = startups[0];
                var notification = {
                    label: 'Nouveau commentaire publié sur la fiche de ' + startup.startupName,
                    url: '#/startup/' + startup._id + '/view',
                    status: 'new',
                    type: "startup",
                    createdAt: new Date()
                };
                Monk.get("user").find({bookmarks: startupId}).then(function (coll) {
                    console.log(coll);
                    if (coll && coll.length > 0) {
                        for (var i in coll) {
                            notification.userId = coll[i]._id + '';
                            notifCollection.insert(notification).error(function (err) {
                                console.log(err);
                            });
                        }
                    }
                    else {
                        console.log('no bookmarks with that id', coll);
                    }
                });
            }
            else {
                console.log('no startup with that id');
            }
        });
    },

    sendNewUser: function (userId) {
        var notifCollection = Monk.get("user-notification");
        var userCollection = Monk.get('user');

        userCollection.find({_id: userId}).then(function (users) {
            if (users && users.length > 0) {
                var user = users[0];
                var notification = {
                    label: 'Nouvel utilisateur à activer : ' + user.firstname + ' ' + user.lastname,
                    url: '#/admin/startup/user',
                    status: 'new',
                    type: "user",
                    createdAt: new Date()
                };
                userCollection.find({roles: 'ADMIN'}).then(function (coll) {
                    if (coll && coll.length > 0) {
                        for (var i in coll) {
                            notification.userId = coll[i]._id + '';
                            notifCollection.insert(notification);
                        }
                    }
                });
            }
        });

    }
};