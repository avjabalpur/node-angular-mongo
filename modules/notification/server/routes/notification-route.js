'use strict';

/**
 * Module dependencies.
 */
module.exports = function (app, router) {
  // Notification Routes
  var Notification = require('../controllers/notification-controller');

  // Notification routes
  router.get('/notifications', Notification.getNotifications);
  router.get('/notifications/:notify_id', Notification.getNotifications);

  // load the Notification router in the app
  app.use('/api/v1', router);

};
