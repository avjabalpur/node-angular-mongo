'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/error-controller')),
  mongoose = require('mongoose'),
  AuthModel = mongoose.model('Auth'),
  nodemailer = require('nodemailer'),
  // mailgun = require('nodemailer-mailgun-transport'),
  async = require('async'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {
        AuthModel.findOne({ email: req.body.email }, '-salt -password', function (err, auth) {
          if (!auth) {
            err = new Error('No account with that username/email has been found');
            return res.status(400).send(errorHandler.getErrorResponse(err));
          } else if (auth.provider !== 'local') {
            err = new Error('It seems like you signed up using your ' + auth.provider + ' account');
            return res.status(400).send(errorHandler.getErrorResponse(err));
          } else {
            auth.resetPasswordToken = token;
            auth.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            auth.save(function (err) {
              done(err, token, auth);
            });
          }
        });
      } else {
        var err = new Error('Email field cannot be empty!');
        return res.status(400).send(errorHandler.getErrorResponse(err));
      }
    },
    function (token, auth, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/auth/server/templates/reset-password'), {
        name: auth.displayName,
        appName: config.app.title,
        url: httpTransport + req.headers.host + '/api/v1/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, auth);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, auth, done) {
      var mailOptions = {
        to: auth.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            result: 'success',
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          err = new Error('Failure sending email');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  AuthModel.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, auth) {
    if (!auth) {
      err = new Error('Token is invalid or expired, please try again');
      return res.status(400).send(errorHandler.getErrorResponse(err));
    }

    res.send({
      result: 'success',
      message: 'Password reset token is valid.'
    });
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  async.waterfall([
    function (done) {
      AuthModel.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {
          $gt: Date.now()
        }
      }, function (err, auth) {
        if (!err && auth) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            auth.password = passwordDetails.newPassword;
            auth.resetPasswordToken = undefined;
            auth.resetPasswordExpires = undefined;

            auth.save(function (err) {
              if (err) {
                return res.status(400).send(errorHandler.getErrorMessage(err));
              } else {
                // Remove sensitive data before return authenticated auth
                auth.password = undefined;
                auth.salt = undefined;

                res.json({
                  result: 'success',
                  message: 'Password reset successfully',
                  data: auth
                });
                done(err, auth);
              }
            });
          } else {
            err = new Error('Passwords do not match');
            return res.status(400).send(errorHandler.getErrorResponse(err));
          }
        } else {
          err = new Error('Password reset token is invalid or has expired.');
          return res.status(400).send(errorHandler.getErrorResponse(err));
        }
      });
    },
    function (auth, done) {
      res.render('modules/auth/server/templates/reset-password-confirm-email', {
        name: auth.displayName,
        appName: config.app.title
      }, function (err, emailHTML) {
        done(err, emailHTML, auth);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, auth, done) {
      var mailOptions = {
        to: auth.email,
        from: config.mailer.from,
        subject: 'Your password has been changed',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};
