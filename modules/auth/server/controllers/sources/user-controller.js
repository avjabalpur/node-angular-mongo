'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/error-controller')),
  mongoose = require('mongoose'),
  AuthModel = mongoose.model('Auth');

/**
 * Get all users by organisation ID
 */
exports.getAllUsers = function (req, res) {
  // chec orgId is set in URL query string
  // check for search query string
  var query = { deleteFlag: false };

  if (req.params.org_id) {
    query.organisationId = req.params.org_id;
  }
  if (req.query.org_id) {
    query.organisationId = req.query.org_id;
  }
  if (req.params.userId) {
    query._id = req.params.userId;
  }

  AuthModel.find(query).sort({ 'updatedAt': -1 }).lean().exec()
    .then(function(users) {
      return res.send({
        success: true,
        data: users
      });
    }, function(err) { console.log(err); });

};

exports.updateUser = function(req, res) {
  if(req.params.userId) {
    AuthModel.findById(req.params.userId).exec()
    .then(function(user) {
      user = _.merge(user, req.body.data);
      user.save()
      .then(function(user) {
        return res.status(200).send({
          success: true,
          msg: 'User updated successfully.',
          data: user
        });
      }, function(err) {

        return res.status(400).send({
          success: false,
          msg: 'User not able to update',
          err: err
        });
      });
    });
  } else {
    var userObj = new AuthModel(req.body.data);
    userObj.save()
      .then(function(user) {
        return res.send({
          success: true,
          data: user
        });
      });
  }
};

exports.addUser = function (req, res) {
  // check email address in request
  if(req.body.data.email) {
    AuthModel.find({ '$or': [{ email: req.body.data.email }, { username: req.body.data.username } ] }).exec()
      .then(function(user) {
        if (user && user.length > 0) {
          return res.status(400).send({
            success: false,
            msg: 'Email or username already registered'
          });
        } else {
          var userObj = new AuthModel(req.body.data);
          userObj.save()
            .then(function(user) {
              return res.send({
                success: true,
                data: user
              });
            });
        }
      });
  } else {
    return res.status(400).send({
      success: false,
      msg: 'Email not found to register'
    });
  }

};
