'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  config = require(path.resolve('./config/config'));


/**
 * Module init function.
 */
module.exports = function (app, router) {
  //session for twitter aouth 1.0
 // app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
  // Add passport's middleware
  app.use(passport.initialize()); 
  //app.use(passport.session()); 
  // Initialize oAuth strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategy/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

};
