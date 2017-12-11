function LoaderStart() {
  $('#loader').show();
}


function LoaderStop() {
  $('#loader').hide();
}
(function (app) {
  'use strict'
  var api_routes = {
    'auth': ['auth', undefined, {
      'login': '/signin',
      'logout': '/signout',
      'go': ['/google', undefined, {
        'callback': '/callback'
      }],
      'fb': ['/facebook', undefined, {
        'callback': '/callback'
      }]
    }],
    'tracker': ['tracker', undefined, {
      'callback': '/Callback',
      'getAllUsersByProject': '/getAllUsersByProject',
      'myself': '/myself',
      'getAllProjects': '/getAllProjects',
      'jiraConnect': '/Connect',
      'getAllUsersByProject': '/getAllUsersByProject',
      'getAllIssuesByProject': '/getAllIssuesByProject',
      'getAllBoards': '/getAllBoards',
      'getIssueById': '/getIssueById'

    }],
    'notifications': ['notifications', undefined, {
      'notifications': '/notifications'
    }]

  };

  angular.module('app').constant('api_config', {

    SportId: 1,
    //api_root: 'http://10.0.0.17/erp_api/api/',
    api_root: window.__api_root,
    // api_root: 'http://909e27e5.ngrok.io/erp_api/api/',
    //api_root: 'http://192.168.1.68/erp_api/api/',
    api_routes: api_routes
  }).value('cgBusyDefaults', {
    message: 'loading',
    backdrop: true,
    delay: 0,
    minDuration: 0
  })
})(window.app);