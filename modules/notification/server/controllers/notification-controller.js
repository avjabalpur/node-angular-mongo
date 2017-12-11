'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  async = require('async'),
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  Notification = require('./sources/notification-controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/error-controller'));

/**
 * Get all Notification Data
 */
module.exports.getNotifications = function (req, res, done) {
  async.waterfall([
    function (next) {
      // get notification
      Notification.getNotifications(req)
        .then(function (notifications) { next(null, notifications); }, function (err) { done(null, err); });
    },
    function (notifications, next) {
      res.send({ status: 'success', data: notifications });
    }
  ], function (err) {
    if (err) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};

