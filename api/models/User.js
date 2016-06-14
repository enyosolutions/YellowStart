/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

'use strict';
var bcrypt = require('bcrypt');


module.exports = {

    attributes: require('waterlock').models.user.attributes({
        firstname: {'type': 'string'},
        lastname: {'type': 'string'},
        function: {'type': 'string'},
        company: {'type': 'string'},
        branch: {'type': 'string'},
        email: {'type': 'email', unique:true, required: true},
        phonenumber: {'type': 'string'},
        password: {'type': 'string'},
        roles: {'type': 'array'},
        isActive: {'type': 'boolean', defaultsTo: false}
    }),

    beforeCreate : function (values, next) {
        bcrypt.genSalt(10, function (err, salt) {
            if(err) return next(err);
            bcrypt.hash(values.password, salt, function (err, hash) {
                if(err) return next(err);
                values.encryptedPassword = hash;
                next();
            })
        })
    },

    comparePassword : function (password, user, cb) {
        bcrypt.compare(password, user.encryptedPassword, function (err, match) {

            if(err) cb(err);
            if(match) {
                cb(null, true);
            } else {
                cb(err);
            }
        })
    }
};
