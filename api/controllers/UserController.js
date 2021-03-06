/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */


module.exports = {
    create: function (req, res) {
        /* if (req.body.password !== req.body.confirmPassword) {
         return res.json(401, {err: 'Password doesn\'t match, What a shame!'});
         }*/

        User.findOne({email: req.body.email}, function (err, user) {
            if (user) {
                return res.json(401, {error: "L'adresse email existe déjà"});
            }

            User.create(req.body).exec(function (err, user) {
                if (err) {
                    return res.json(err.status, {err: err});
                }
                // If user created successfuly we return user and token as response
                if (user) {
                    // NOTE: payload is { id: user.id}
                    res.json(200, {user: user});
                    MailService.sendAccountCreationEmail(user.email, {user: user});
                    NotificationService.sendNewUser(user.id);
                    Monk.get('user').find({roles: 'ADMIN'}).then(function (coll) {
                        if (coll && coll.length > 0) {
                            var emails = coll.map(function (elm) {
                                return elm.email;
                            });
                            MailService.sendAccountCreationEmailAdmin(emails, {user: user});
                        }
                    });
                }
            });
        });
    },
    getByToken: function (req, res) {
        Monk.get('user').find({resetToken: req.param('resetToken')})
            .on('success', function (data) {
                data[0].statusCode = 200;
                res.json(data[0]);
            })
            .on("error", function (err) {
                res.json(500, {error: err});
            });
    },
    reset: function (req, res) {
        User.findOne({resetToken: req.params.resetToken}, function (err, user) {
            if (!user || user.length < 1) {
                return res.json(404, {error: "Il n'y a pas de compte avec ce token"});
            }


            user.resetToken = "";
            user.password = req.body.password;
            console.log(user);
            User.update(user.id, user).exec(function (err, updated) {
                if (err) {
                    return res.json(403, {error: 'forbidden'});
                }
                if (!updated || updated.length < 1) {
                    return res.json(401, {error: 'Email ou mot de passe invalide'});
                } else {
                    console.log('UPDATE RESULTS', updated.length, updated[0]);
                    delete updated[0].password;
                    delete updated[0].encryptedPassword;
                    res.json({
                        user: updated[0]
                    });
                }
            });
        });
    },
    update: function (req, res) {
        var extend = require('extend');
        console.log(req.body, req.params.id);
        User.findOne({id: req.params.id}, function (err, user) {
            if (!user) {
                return res.json(401, {error: "Il n'y a pas de compte avec cet identifiant"});
            }

            var data = extend(true, {}, user, req.body, {lastModifiedAt: new Date()});
            User.update(req.params.id, data).exec(function (err, updated) {
                if (err) {
                    return res.json(403, {error: 'forbidden'});
                }
                if (!updated) {
                    return res.json(401, {error: 'Email ou mot de passe invalide'});
                } else {
                    delete updated[0].encryptedPassword;
                    res.json({
                        user: updated[0]
                    });
                }
            });
        })
    },

    'uploadFile': function (req, res, next) {
        console.log('upload files', req.token);
        var id = req.token.id;
        console.log('startup id', id);
        var userCollection = Monk.get('user');
        userCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var user = col[0];
                req.file('file').upload({
                    // don't allow the total upload size to exceed ~10MB
                    maxBytes: 10000000,
                    dirname: sails.config.appPath + '/assets/data/user/' + id
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
                    user.picture = '/data/user/' + id + '/' + filename;

                    userCollection.update({_id: id}, user).then(function () {
                        res.json(200, {body: user.picture});
                    });
                });
            }
            else {
                console.log('User not found');
                res.json(404, {error: 'User not found'});
            }
        });

    },

    'removeFile': function (req, res, next) {
        console.log('upload files', req.token);
        var id = req.token.id;

        var userCollection = Monk.get('user');
        userCollection.find({_id: id}).then(function (col) {
            if (col && col.length > 0) {
                var user = col[0];
                var fs = require('fs');
                fs.unlink(sails.config.appPath + '/assets' + user.picture, function (err) {
                    if (err) {
                        return res.negotiate(err);
                    }

                    // Save the "fd" and the url where the avatar for a user can be accessed

                    delete user.picture ;

                    userCollection.update({_id: id}, user).then(function () {
                        res.json(200, {body: user});
                    });
                });
            }
            else {
                console.log('User not found');
                res.json(404, {error: 'User not found'});
            }
            
            
            
        });

    }

};