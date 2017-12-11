'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

/**
 * Load instanciated NotificationSchema
 */
var NotificationSchema = require('./schema/notification-schema');

/**
 * Hook a pre save method to add date
 */
NotificationSchema.pre('save', function (next) {

  if (!this.createdAt) {
    this.createdAt = Date.now();
  }

  this.updatedAt = Date.now();

  next();
});

mongoose.model('Notification', NotificationSchema);
