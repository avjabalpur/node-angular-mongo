'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  Auth = require('../../controllers/auth-controller');

module.exports = function (config) {
  // Use Facebook strategy
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passReqToCallback: true,
    profileFields: ['id', 'emails', 'name'] //This
  },
    function (req, accessToken, refreshToken, profile, done) {
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
        provider: 'facebook',
        providerIdentifierField: 'id',
        providerData: providerData,
        activeFlag: true
      };

      // Save the user OAuth profile
      Auth.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
