/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

    attributes: require('waterlock').models.user.attributes({
        firstname: {'type': 'string'},
        lastname: {'type': 'string'},
        function: {'type': 'string'},
        company: {'type': 'string'},
        branch: {'type': 'string'},
        email: {'type': 'email', unique:true},
        phonenumber: {'type': 'string'},
        password: {'type': 'string'},
        roles: {'type': 'array'},
        isActive: {'type': 'boolean', defaultsTo: false}
    }),

    beforeCreate: require('waterlock').models.user.beforeCreate,
    beforeUpdate: require('waterlock').models.user.beforeUpdate
};
