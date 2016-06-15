/**
 * AuthController
 *
 * @module      :: Controller
 * @description    :: Provides the base authentication
 *                 actions used to make waterlock work.
 *m
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

    get: function (req, res) {
        User.findOne(req.token.id).exec(function (err, message) {
            if (message) {
                delete message.password;
                res.json({
                    user: message
                });
            }
            else {
                res.json(404, {
                    error: "Le user n'a pas été trouvé"
                });
            }
        });


    },

    login: function (req, res) {
        var email = req.param('email');
        var password = req.param('password');


        if (!email || !password) {
            return res.json(401, {error: 'email and password required'});
        }

        User.findOne({email: email}, function (err, user) {
            if (!user) {
                return res.json(401, {error: "Il n'y a pas de compte avec cette adresse mail"});
            }


            User.comparePassword(password, user, function (err, valid) {
                if (err) {
                    return res.json(403, {error: 'forbidden'});
                }

                if (!valid) {
                    return res.json(401, {error: 'Email ou mot de passe invalide'});
                } else {
                    var token = jwToken.issue({id: user.id});
                    delete user.password;
                    res.json({
                        user: user,
                        token: token
                    });
                }
            });
        })
    }

};