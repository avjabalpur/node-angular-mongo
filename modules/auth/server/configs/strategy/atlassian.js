'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
AtlassianOAuthStrategy = require('passport-atlassian-oauth').Strategy,
  Auth = require('../../controllers/auth-controller');

module.exports = function (config) {
  // Use Atlassian strategy
  passport.use(new AtlassianOAuthStrategy({
    applicationURL: "http://localhost:2990/jira",
    callbackURL: "http://localhost:5000/auth/atlassian-oauth/callback",
    consumerKey: "mykey",
    consumerSecret: "<RSA private key>",
  },
    function (req, token, tokenSecret, profile, done) {
      // User.findOrCreate({ userid: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.pictureUrl) ? providerData.pictureUrl : undefined,
        provider: 'atlassian',
        providerIdentifierField: 'id',
        providerData: providerData,
        activeFlag: true
      };
      Auth.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
  };