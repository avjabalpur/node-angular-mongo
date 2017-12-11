'use strict';


var config = require('../config/tracker-config');
/**
 * Module dependencies.
 */
module.exports = function (app, router) {
  // UserList Routes
  var tracker = require('../controllers/tracker-controller');

  // UserList routes
  router.get('/AllProjectCategories', tracker.getAllProjectCategories);
  router.post('/Connect', tracker.jiraConnect);
  router.post('/Callback', tracker.jiraConnectCallback);
  router.get('/myself', tracker.getMyself); 
  router.get('/getAllProjects', tracker.getAllProjects); 
  router.post('/getAllUsersByProject', tracker.getAllUsersByProject);
  router.post('/getAllIssuesByProject', tracker.getAllIssuesByProject);
  router.post('/getAllBoards', tracker.getAllBoards);
  router.post('/getIssueById', tracker.getIssueById);  

  // load the Role router in the app
  app.use('/api/v1/tracker', config.trackerMiddeLayer, router);

};
