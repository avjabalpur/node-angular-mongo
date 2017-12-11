'use strict';

var _ = require('lodash'),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  NotificationModel = mongoose.model('Notification'),
  cookie = require('cookie');

// Define the Socket.io configuration method
module.exports = function (io, socket) {
  socket.on('notification', function (data, callback) {
    var cookies = cookie.parse(socket.handshake.headers['cookie']);
    var sessionId = socket.handshake.headers.cookie ? cookies['connect.sid'].split('.')[0].split(':')[1] : undefined;
    console.log("Seession on notification:" + sessionId);
    console.log('notification message in auth socket folder');
    return new Promise(function (resolve, reject) {
      var notificationObj = new NotificationModel(data);
      notificationObj.save()
        .then(function (org) {
          return resolve(callback(org));
        }, function (err) {
          console.log(err);
          return  reject(callback(err));
        });
    });
  });
};