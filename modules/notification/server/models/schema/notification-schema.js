'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validator = require('validator');

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
  code: { type: String },
  key: { type: String },
  name: { type: String },
  type: { type: String },
  from: {
    orgId: { type: Schema.Types.ObjectId },
    pjtId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    userType: { type: String }
  },
  to: {
    orgId: { type: Schema.Types.ObjectId },
    pjtId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    userType: { type: String }
  },
  title: { type: String },
  message: {
    notify: { type: String },
    alert: { type: String },
    activity: { type: String },
  },
  notifyFlag: { type: Boolean },
  alertFlag: { type: Boolean },
  activityFlag: { type: Boolean },
  data: { type: Object },
  sentFlag: { type: Boolean, default: false },
  viewFlag: { type: Boolean, default: false },
  deleteFlag: { type: Boolean, default: false },
  createdBy: Schema.Types.ObjectId,
  updatedBy: Schema.Types.ObjectId,
  createdAt: { type: Date },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = NotificationSchema;
