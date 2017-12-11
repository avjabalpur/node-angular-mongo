'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  async = require('async'),
  Role = require('./sources/role-controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/error-controller'));

/**
 * Get all Role Data
 */
module.exports.getRole = function (req, res, done) {
  async.waterfall([
    function (next) {
      Role.getRoleList(req)
        .then(function (roles) { next(null, roles); }, function (err) { done(null, err); });
    },
    function (roles, next) {
      res.send({ status: 'success', data: roles });
    }
  ], function (err) {
    if (err) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};

/**
 * Save roles
 */
module.exports.saveRole = function (req, res, done) {
  async.waterfall([
    function (next) {
      Role.save(req)
        .then(function (roles) { next(null, roles); }, function (err) { done(null, err); });
    },
    function (roles, next) {
      res.send({ status: 'success', msg: 'Roles saved successfully', data: roles });
    }
  ], function (err) {
    if (err) {
      return res.status(400).send(errorHandler.getErrorResponse(err));
      // return done(err);
    }
  });
};
