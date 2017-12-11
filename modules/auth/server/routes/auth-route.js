'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app, router) {
  // User Routes
  var Auth = require('../controllers/auth-controller');

  // Setting up the users authentication api
  router.post('/signup', Auth.signup);
  router.post('/signin', Auth.signin);
  router.get('/signout', Auth.signout);

  // username & email validation api
  router.get('/username/:name', Auth.uniqueUser);
  router.get('/email/:email', Auth.uniqueEmail);

  // user activate
  router.get('/activate/:token', Auth.activate);
  router.post('/activate/link', Auth.activateLink);

  // Setting up the users password api
  router.post('/forgot', Auth.forgot);
  router.get('/reset/:token', Auth.validateResetToken);
  router.post('/reset/:token', Auth.reset);

  // Setting the google oauth routes
  router.get('/google', Auth.oauthCall('google', {
    scope: ['email profile']
  }));
  router.get('/google/callback', Auth.oauthCallback('google'));

  // Setting the linkedin oauth routes
  router.get('/linkedin', Auth.oauthCall('linkedin', {
    scope: [
      'r_basicprofile',
      'r_emailaddress'
    ]
  }));
  router.get('/linkedin/callback', Auth.oauthCallback('linkedin'));

  // Setting the facebook oauth routes
  router.get('/facebook', Auth.oauthCall('facebook', {
    scope: [
      'email', 'public_profile'
    ]
  }));
  router.get('/facebook/callback', Auth.oauthCallback('facebook'));

  // Setting the facebook oauth routes
  router.get('/twitter', Auth.oauthCall('twitter', {
    scope: [
      'email', 'public_profile'
    ]
  }));
  router.get('/twitter/callback', Auth.oauthCallback('twitter'));



  // middleware that is specific to this router to check user authenticated to access the api
  router.use(Auth.isAuthenticated);

  // Setting up the users profile api
  router.get('/', Auth.getAuth);
  router.put('/', Auth.update);
  router.get('/users', Auth.getAllUsers);
  router.get('/users/:userId', Auth.getAllUsers);
  router.post('/users', Auth.addUser);
  router.put('/users/:userId', Auth.updateUser);
  // router.route('/accounts').delete(Auth.removeOAuthProvider);
  router.post('/password', Auth.changePassword);
  router.post('/picture', Auth.changeProfilePicture);

  // load the auth router in the app
  app.use('/api/v1/auth', router);





};