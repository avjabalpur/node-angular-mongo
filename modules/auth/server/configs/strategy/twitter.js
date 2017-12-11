'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  Auth = require('../../controllers/auth-controller');

module.exports = function (config) {
  // Use Facebook strategy
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    passReqToCallback: true,
  },
    function (req, accessToken, refreshToken, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.accessToken = accessToken;
      providerData.refreshToken = refreshToken;

      // Create the user OAuth profile
      var providerUserProfile = {
        //   firstName: profile.name.givenName,
        //   lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        username: profile.username,
        profileImageURL: (providerData.profile_image_url) ? providerData.profile_image_url : undefined,
        provider: 'twitter',
        providerIdentifierField: 'id',
        providerData: providerData,
        activeFlag: true
      };

      // Save the user OAuth profile
      Auth.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
