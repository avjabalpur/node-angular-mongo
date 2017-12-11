'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  crypto = require('crypto'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * Load instanciated AuthSchema
 */
var AuthSchema = require('./schema/auth-schema');

/**
 * Hook a pre save method to hash the password
 */
AuthSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }
  if (!this.activateToken && !this.activeFlag) {
    this.activateToken = crypto.randomBytes(16).toString('hex');
    // 86400000 = 1 day in milliseconds
    // TODO: activate token expiry days should save in config
    this.activateTokenExpires = Date.now() + (1 * 86400000);
  }
  if (!this.createdAt) {
    this.createdAt = Date.now();
  }

  this.updatedAt = Date.now();

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
AuthSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(', ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
AuthSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
AuthSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
AuthSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Generates a random passphrase that passes the owasp test.
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
AuthSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase.
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters.
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

mongoose.model('Auth', AuthSchema);
