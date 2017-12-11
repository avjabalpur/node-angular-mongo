'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  passport = require('passport'); 
   

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./sources/authentication-controller'),
  require('./sources/authorization-controller'),
  require('./sources/password-controller'),
  require('./sources/user-controller')
);
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup',
  '/google',
  '/auth/google',
  '/facebook',
  '/jiraConnect/callback',
  '/jiraConnect',
  '/jira/jiraConnect',
  '/jirausers',
  '/youtrack/youtrackusers',
  '/youtrackusers'
];

/**
 * Middleware to check user authenticated before route export
 */
module.exports.isAuthenticated = function (req, res, next) {
  // if (!req.isAuthenticated()) {
  //   return res.status(403).send({
  //     success: false,
  //     message: 'Failed to authenticate token.',
  //     err: null
  //   });
  // }else{
  //  return next();
  // }

  passport.authenticate('jwt', { session: false }, function (err, auth, info) {
    // ser user object in request
    if (auth)
      req.user = { id: auth.id, userType: auth.userType };


    var url = req.url.split('?');
    if (url.length > 0) {
      url = url[0];
    }
    else {
      url = req.url;
    }

    if (noReturnUrls.indexOf(url) !== -1) {
      next();
      return;
    }
    if (err || !auth) {
      return res.status(403).send({
        success: false,
        message: 'Failed to authenticate token.',
        err: err
      });
    }


    next();
  })(req, res, next);

};
