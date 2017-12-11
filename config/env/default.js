'use strict';

module.exports = {
  app: {
    title: 'API',
    description: 'API built in Full Stack MEAN.JS',
    keywords: 'mongodb, express, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 5000,
  templateEngine: 'swig',
  // jwt session settings // secret should change for security
  jwtSuperSecret: process.env.SESSION_SECRET || 'amQ,5z)9E24_)qG[FK,UkD*p@123',
  jwtExpire: 24 * (60 * 60 * 1000),
  sessionSecret:process.env.COOKIE_SECRET || 'amQ,5z)9E24_)qG[FK,UkD*p@123',
  logo: './ui/app/img/brand/logo.png',
  favicon: './ui/app/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './storage/uploads/users/profile', // Profile upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    }
  }
};
