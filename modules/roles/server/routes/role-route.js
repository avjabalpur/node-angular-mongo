'use strict';

/**
 * Module dependencies.
 */
module.exports = function (app, router) {
  // UserList Routes
  var Role = require('../controllers/role-controller');

  // UserList routes
  router.post('/rolelist', Role.saveRole);
  router.put('/rolelist/:role_id', Role.saveRole);
  router.get('/rolelist', Role.getRole);
  router.get('/rolelist/:role_id', Role.getRole);

  // load the Role router in the app
  app.use('/api/v1', router);

};
