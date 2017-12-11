'use strict';

/**
 * Module dependencies.
 */
var jiraFactory = require('../controllers/sources/jira'),
  youtrack = require('../controllers/sources/jira');


module.exports.trackerMiddeLayer = function (req, res, next) {
  switch (req.user.userType.toLocaleLowerCase()) {
    case 'jira':
      req.trackTool = new jiraFactory(req);
      break;
    case 'youtrack':
      req.trackTool = new jiraFactory(req);
      break;
    default:
   //   req.trackTool = new youtrack(req);
      break;

  }
  next();
};


