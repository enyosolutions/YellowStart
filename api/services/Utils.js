

module.exports = {
    md5: function(string){
        var crypto = require('crypto');
        return  crypto.createHash('md5').update(string).digest('hex');
    }
};