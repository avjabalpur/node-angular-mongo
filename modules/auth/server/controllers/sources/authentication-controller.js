'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/error-controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  jwt = require('jsonwebtoken'),
  nodemailer = require('nodemailer'),
  AuthModel = mongoose.model('Auth');

// SMTP mail transport
var smtpTransport = nodemailer.createTransport(config.mailer.options);

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup',
  '/jira/jirConnect/callback'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  // delete req.body.roles;

  // Init Variables
  var auth = new AuthModel(req.body);
  var message = null;

  // Add missing user fields
  auth.provider = (auth.provider) ? auth.provider : 'local';
  auth.displayName = auth.name.first + ' ' + auth.name.last;

  // Then save the user
  auth.save(function (err) {
    // TODO: better error handling
    if (err) {
      return res.status(400).send(errorHandler.getErrorMessage(err));
    } else {

      var activateUrl = config.domain.url + '/api/' + config.domain.version + '/auth/activate/' + auth.activateToken;
      var mailOptions = {
        to: auth.email,
        from: config.mailer.from,
        subject: 'API - User activation mail',
        html: '<h2>User activation email<h2> <a href="' + activateUrl + '">' + activateUrl + '</a>'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          // Remove sensitive data before login
          auth.password = undefined;
          auth.salt = undefined;
          auth.activateToken = undefined;
          res.json({
            'result': 'success',
            'message': 'User registered successfully & activation mail sent to registered email',
            'data': auth
          });
        } else {
          console.log(err);
          err = new Error('User registered successfully, Activation mail not set, click on resent link to sent activation mail');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', {
    'session': true
  }, function (err, auth) {
    if (err || !auth) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
    } else {
      // send user object in request
      req.user = {
        id: auth.id
      };

      if (auth.lastLoginAt === undefined) {
        auth.lastLoginAt = new Date();
        auth.save(function (err, auth) {
          if (err) {
            return res.status(400).send(errorHandler.getErrorMessage(err));
          }

          // Remove sensitive data before response
          auth.password = undefined;
          auth.salt = undefined;
          auth.activateToken = undefined;
          req.newUser = true; // custom field
        });
      } else {
        // Remove sensitive data before response
        auth.password = undefined;
        auth.salt = undefined;
        auth.activateToken = undefined;
        req.newUser = false; // custom field
      }

      // TODO: set auth token expiry time in config
      req.token = jwt.sign(req.user, req.app.get('superSecret'), {
        expiresIn: 604800 // expires in 168 hours (7 days)
      });
      req.login(auth, function(err) {
        if (err) {
           return res.status(500).send("There was an error logging in. Please try again later.");
        }
      });
      res.status(200).json({
        'result': 'success',
        'message': 'User loggedin successfully',
        'newUser': req.newUser,
        'token': req.token,
        'data': auth
      });
    }
  })(req, res, next);
};

/**
 * Check username
 */
exports.uniqueUser = function (req, res, next) {
  // validate active token
  AuthModel.findOne({
    username: req.params.name
  }, function (err, auth) {
    if (err) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }

    if (!auth) {
      return res.status(201).send({
        result: 'success',
        message: 'Unique username :)'
      });
    }
    // update user activate data
    auth.activateToken = undefined;
    auth.activateTokenExpires = undefined;
    auth.password = undefined;
    auth.salt = undefined;

    res.json({
      result: 'fails',
      message: 'Username already taken :(',
      data: auth
    });
  });
};

exports.uniqueEmail = function (req, res, next) {
  // validate active token
  AuthModel.findOne({
    email: req.params.email
  }, function (err, auth) {
    if (err) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }

    if (!auth) {
      return res.status(201).send({
        result: 'success',
        message: 'Unique email :)'
      });
    }
    // update user activate data
    auth.activateToken = undefined;
    auth.activateTokenExpires = undefined;
    auth.password = undefined;
    auth.salt = undefined;

    res.json({
      result: 'fails',
      message: 'Email already taken :(',
      data: auth
    });
  });
};

/**
 * Activate (user email verification)
 */
exports.activate = function (req, res, next) {
  // validate active token
  AuthModel.findOne({
    activateToken: req.params.token,
    activateTokenExpires: {
      $gt: Date.now()
    }
  }, function (err, auth) {
    if (err || !auth) {
      if (!err) {
        err = new Error('Active token is invalid or expired, please try again (activation link)');
      }
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }
    // update user activate data
    auth.activateToken = undefined;
    auth.activateTokenExpires = undefined;
    auth.activeFlag = 1;

    auth.save(function (err) {
      // TODO: better error handling
      if (err) {
        return res.status(400).send(errorHandler.getErrorMessage(err));
      } else {
        // Remove sensitive data before login
        auth.password = undefined;
        auth.salt = undefined;

        // TODO: send welcome mail after activation
        res.json({
          'result': 'success',
          'message': 'User activated successfully',
          'data': auth
        });
      }
    });
  });
};

/**
 * Activate Link (send user activte token in email)
 */
exports.activateLink = function (req, res, next) {
  // validate active token
  AuthModel.findOne({
    email: req.body.email
  }, function (err, auth) {
    if (err || !auth) {
      if (!err) err = new Error('Email not found');
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }

    if (auth.activeFlag) {
      err = new Error('User already active, Please login');
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }
    // remove activateToken will reset in auth model
    auth.activateToken = undefined;

    auth.save(function (err) {
      // TODO: better error handling
      if (err) {
        return res.status(400).send(errorHandler.getErrorMessage(err));
      } else {
        // Remove sensitive data before login
        auth.password = undefined;
        auth.salt = undefined;

        // TODO: send out activation mail to registered user email
        res.json({
          'result': 'success',
          'message': 'User activation link sent to registered email',
          'data': auth
        });
      }
    });
  });
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout(); 
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {

  return function (req, res, next) {

    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      if (strategy) {
        switch (strategy) {
          case "facebook":
            req.session.redirect_to = '/api/v1/auth/facebook/callback';
            break;
          case "google":
            req.session.redirect_to = '/api/v1/auth/google/callback';
            break;
          case "twitter":
            req.session.redirect_to = '/api/v1/auth/twitter/callback';
            break;
          case "linkedin":
            req.session.redirect_to = '/api/v1/auth/linkedin/callback';
            break;
        }
      }
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        req.user = {
          id: user.id
        };
        res.user = {
          id: user.id
        };
        // TODO: set auth token expiry time in config
        res.token = jwt.sign(req.user, req.app.get('superSecret'), {
          expiresIn: 604800 // expires in 168 hours (7 days)
        });

        return res.redirect('/externalLoginCallback?st=' + strategy + '&oauth_token=' + res.token);
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    AuthModel.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          AuthModel.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            var auth = user = new AuthModel({
              name: {
                first: providerUserProfile.firstName,
                last: providerUserProfile.lastName
              },
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData,
              activeFlag: providerUserProfile.activeFlag || false
            });

            // And save the user
            auth.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/Auths');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var reqUserAuth = req.user;
  var provider = req.query.provider;

  if (!reqUserAuth) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (reqUserAuth.additionalProvidersData[provider]) {
    delete reqUserAuth.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    reqUserAuth.markModified('additionalProvidersData');
  }

  reqUserAuth.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(reqUserAuth, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(reqUserAuth);
        }
      });
    }
  });
};