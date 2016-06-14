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
                    res.json(200, {user: user, token: jwToken.issue({id: user.id})});
                }
            });
        });

    },

    update: function (req, res) {

        User.findOne({_id: req.body._id}, function (err, user) {
            if (!user) {
                return res.json(401, {error: "Il n'y a pas de compte avec cette adresse mail"});
            }

            var data = extend(true, {}, original, req.body, {lastModifiedAt: new Date()});
            User.update(data._id, data).exec(function (err, updated) {
                if (err) {
                    return res.json(403, {error: 'forbidden'});
                }

                if (!updated) {
                    return res.json(401, {error: 'Email ou mot de passe invalide'});
                } else {
                    delete updated.password;
                    res.json({
                        user: updated
                    });
                }
            });
        })
    }

};