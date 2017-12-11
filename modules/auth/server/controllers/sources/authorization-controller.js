'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/error-controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  passport = require('passport'),
  // JwtBearerStrategy = require('passport-http-jwt-bearer'),
  AuthModel = mongoose.model('Auth');

/**
 * Auth middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  AuthModel.findOne({ _id: id }).exec(function (err, auth) {
    if (err) {
      return next(err);
    } else if (!auth) {
      return next(new Error('Failed to load User ' + id));
    }
    auth.password = undefined;
    auth.salt = undefined;

    req.profile = auth;
    next();
  });
};

/**
 * Get Auth details from header token
 */
exports.getAuth = function (req, res) {
  console.log(req.user);
  if(req.user) {
    AuthModel.findOne({ _id: req.user.id }).exec(function (err, auth) {
      if (err) {
        return res.status(401).send(errorHandler.getErrorMessage(err));
      } else if (!auth) {
        err = new Error('Failed to load User ' + req.user.id);
        return res.status(401).send(errorHandler.getErrorMessage(err));
      }
      auth.password = undefined;
      auth.salt = undefined;
      auth.serviceProvider = undefined;
      return res.json({
        result: 'success',
        data: auth
      });
    });
  } else {
    var err = new Error('User not authenticated');
    return res.status(401).send(errorHandler.getErrorMessage(err));
  }
};

/**
 * Update user details
 */
exports.update = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  // delete req.body.roles;

  if (req.user) {
    AuthModel.findOne({ _id: req.user.id }).exec(function (err, auth) {
      if (err) {
        return res.status(400).send(errorHandler.getErrorResponse(err));
      } else if (!auth) {
        err = new Error('Failed to load User ' + req.user.id);
        return res.status(400).send(errorHandler.getErrorResponse(err));
      }

      // Merge existing user
      auth = _.extend(auth, req.body);
      auth.updated = Date.now();
      auth.displayName = auth.name.first + ' ' + auth.name.last;

      auth.save(function (err) {
        if (err) {
          return res.status(400).send(errorHandler.getErrorMessage(err));
        } else {
          auth.password = undefined;
          auth.salt = undefined;

          return res.json({
            result: 'success',
            data: auth
          });
        }
      });
    });
  } else {
    var err = new Error('User not signed in');
    return res.status(400).send(errorHandler.getErrorResponse(err));
  }
};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var err = null;

  if (req.user) {
    if (passwordDetails.newPassword) {
      AuthModel.findById(req.user.id, '-salt -password', function (err, auth) {
        // check error in findById
        if (err || !auth) {
          err = new Error('User not found');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        }
        // check the current password is valid
        if (!auth.authenticate(passwordDetails.currentPassword)) {
          err = new Error('Current password is incorrect');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        }
        // check verify password
        if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
          err = new Error('Passwords do not match');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        }

        // save auth with new password
        auth.password = passwordDetails.newPassword;

        auth.save(function (err) {
          if (err) {
            return res.status(400).send(errorHandler.getErrorMessage(err));
          } else {
            return res.send({
              result: 'success',
              message: 'Password changed successfully'
            });
          }
        });
      });
    } else {
      err = new Error('Please provide a new password');
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }
  } else {
    err = new Error('User is not signed in');
    return res.status(400).send(errorHandler.getErrorResponse(err));
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var err = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (req.user.id) {
    AuthModel.findById(req.user.id, '-salt -password', function (err, auth) {
      upload(req, res, function (uploadError) {
        if(uploadError) {
          err = new Error('Error occurred while uploading profile picture');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        } else {
          auth.profileImageURL = config.uploads.profileUpload.dest + '/' + req.file.filename;

          auth.save(function (saveError) {
            if (saveError) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(saveError)
              });
            } else {
              return res.send({
                result: 'success',
                message: 'Profile picture updated successfully',
                data: auth
              });
            }
          });
        }
      });
    });
  } else {
    err = new Error('User is not signed in');
    return res.status(400).send(errorHandler.getErrorResponse(err));
  }
};
