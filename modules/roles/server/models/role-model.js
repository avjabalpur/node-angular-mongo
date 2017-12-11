'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Load instanciated RoleSchema
 */
var RoleSchema = require('./schema/role-schema');

/**
 * Hook a pre save method to add date
 */
RoleSchema.pre('save', function (next) {

  if (!this.createdAt) {
    this.createdAt = Date.now();
  }

  this.updatedAt = Date.now();

  next();
});

mongoose.model('Rolelist', RoleSchema);
