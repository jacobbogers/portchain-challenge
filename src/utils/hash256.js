const crypto = require('crypto');

module.exports = function hash256(data){
    return crypto.createHash('sha256').update(data, 'utf8').digest();
}