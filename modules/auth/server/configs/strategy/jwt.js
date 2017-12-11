'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  passportJWT = require('passport-jwt'),
  JwtStrategy = passportJWT.Strategy,
  ExtractJwt = passportJWT.ExtractJwt,
  AuthModel = require('mongoose').model('Auth');

/**
 * Verify the auth token in header is valid
 * @param config
 * @return user object
 */
module.exports = function (config) {

  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.jwtSuperSecret || 'amQ,5z)9E24_)qG[FK,UkD*p@123';
  // opts.issuer = "accounts.NodeAPI.com";
  // opts.audience = "NodeAPI.com";

  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    AuthModel.findById(jwt_payload.id, function (err, auth) {
      if (err) {
        return done(err, false);
      }
      if (auth) {
        done(null, auth);
      } else {
        done(null, false);
      }
    });
  }));

};
