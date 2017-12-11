'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * Purchase Schema
 */
var RoleSchema = new Schema({
  organisationId: Schema.Types.ObjectId,
  name: {
    type: String
  },
  parentId: {
    type: String
  },
  deleteFlag: { type: Boolean, default: false },
  createdBy: Schema.Types.ObjectId,
  updatedBy: Schema.Types.ObjectId,
  createdAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = RoleSchema;
