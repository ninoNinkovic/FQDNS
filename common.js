// Generated by CoffeeScript 1.9.1
var crypto, fs, getPWD;

fs = require('fs');

crypto = require('crypto');

exports.getID = function(msg) {
  return msg.readUIntBE(0, 2);
};

exports.parseConfig = (function(key) {
  var configJSON;
  configJSON = null;
  return (function() {
    if (this.configJSON == null) {
      this.configJSON = JSON.parse(fs.readFileSync('./config.json').toString());
    }
    return this.configJSON[key];
  })();
});

exports.encrypt = function(msg) {
  var cipher;
  cipher = crypto.createCipher('aes-256-cbc', getPWD());
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(msg), cipher.final()]);
};

exports.decrypt = function(msg) {
  var decipher;
  decipher = crypto.createDecipher('aes-256-cbc', getPWD());
  return Buffer.concat([decipher.update(msg), decipher.final()]);
};

getPWD = (function() {
  var password;
  password = null;
  return (function() {
    var iter, len, pwd, salt;
    if (this.password == null) {
      pwd = exports.parseConfig('key_pwd');
      salt = exports.parseConfig('key_salt');
      iter = parseInt(exports.parseConfig('key_iter'));
      len = parseInt(exports.parseConfig('key_len'));
      this.password = crypto.pbkdf2Sync(pwd, salt, iter, len).toString('hex');
    }
    return this.password;
  })();
});