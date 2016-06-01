//var mongo = require('mongodb');

module.exports = require('monk')(sails.config.mongo.user + ':'+sails.config.mongo.password +'@' +
sails.config.mongo.host + '/' + sails.config.mongo.database);