'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  NotificationModel = mongoose.model('Notification');

/**
 * Get Category details
 * @param: id (int|all) category id or all
 * @return: category (array | object)
 */
exports.getNotifications = function (req) {
  var query = { deleteFlag: false };
  console.log(req.user);
  if (req.params.notify_id) {
    if (req.params.notify_id === 'all') {

    } else {
      query._id = req.params.notify_id;
    }
  }
  // add notify to condition with current logged in user id
  var filter = { 'updatedAt': -1 };
  if (req.query.time) {
    switch (req.query.time) {
      case 'today':
        // filter
        break;
    }
  }
  if (req.query.type) {
    switch (req.query.type) {
      case 'activity':
        query.activityFlag = true;
        break;
      case 'alert':
        query.alertFlag = true;
        break;
      case 'notify':
        query.notifyFlag = true;
        break;
      default:
        break;
    }
  }
 
  console.log('-----query to execute notification data--------');
  console.log(query);

  return new Promise(function(resolve, reject) {
    NotificationModel.find(query).sort(filter).limit(10).lean().exec()
      .then(function(notifications) {
        var result = {};
        result.notifications = [];
        result.alerts = [];
        result.activities = [];
        _.forEach(notifications, function (notify, key) {
          if (notify.notifyFlag) { result.notifications.push(notify); }
          if (notify.alertFlag) { result.alerts.push(notify); }
          if (notify.activityFlag) { result.activities.push(notify); }
        });

        resolve(result);
      }, function(err) { reject(err); });
  });

};
