'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  RoleModel = mongoose.model('Rolelist');

/**
 * Get Category details
 * @param: id (int|all) category id or all
 * @return: category (array | object)
 */
exports.getRoleList = function (req) {
  var query = {};
  if (req.params.role_id === 'all') {
    query = { deleteFlag: false };
  } else {
    query = { _id: req.params.role_id, deleteFlag: false };
  }
  if (req.query.role_id) {
    query.organisationId = req.query.role_id;
  }

  return new Promise(function(resolve, reject) {
    RoleModel.find(query).sort({ 'updatedAt': -1 }).lean().exec()
      .then(function(org) { resolve(org); }, function(err) { reject(err); });
  });

};

/**
 * Save Schedule details
 * @param: req (object) request object with params & data
 * @return: category (array | object)
 */
exports.save = function (req) {
  return new Promise(function(resolve, reject) {
    if (! _.isUndefined(req.params.role_id) && req.params.role_id !== '') {
      RoleModel.findById(req.params.role_id).exec()
        .then(function(org) {
          org = _.merge(org, req.body.data);
          org.save()
            .then(function(org) { resolve(org); }, function(err) { reject(err); });
        }, function(err) { reject(err); });
    } else {
      var roleObj = new RoleModel(req.body.data);
      roleObj.save()
        .then(function(org) { resolve(org); }, function(err) { console.log(err); reject(err); });
    }
  });
};
