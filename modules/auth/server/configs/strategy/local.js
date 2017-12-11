'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  session = require('express-session'),
  LocalStrategy = require('passport-local').Strategy,
  AuthModel = require('mongoose').model('Auth');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy(function (username, password, done) {
    AuthModel.findOne({ $or: [{ email: username }, { username: username }] }, function (err, auth) {
      // return the error
      if (err) { return done(err); }
      // check auth password is valid
      if (!auth || !auth.authenticate(password)) {
        return done(new Error('Invalid username or password'), false);
      }
      // check auth is active
      if (!auth.activeFlag) {
        var tokenUrl;
        if (process.env.NODE_ENV === 'development') {
          tokenUrl = ' Dev activate url \n\n http://localhost:5000/api/v1/auth/activate/' + auth.activateToken;
        }
        return done(new Error('User not active, please check your registered email to activate' + tokenUrl), false);
      }
      if (auth.deleteFlag) {
        return done(new Error('Cannot login, please contact admin for more details'), false);
      }

      return done(null, auth);
    });
  }));
  passport.serializeUser(function (user, done) {
    // console.log('serializing user: ');
    // console.log(user);
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    AuthModel.findById(id, function (err, user) {
      // console.log('no im not serial');
      done(err, user);
    });
  });
};
