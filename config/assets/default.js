'use strict';

module.exports = {
  server: {
    gruntConfig: 'gruntfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js', 'modules/*/sockets/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/sockets/**/*.js',
    configs: 'modules/*/server/configs/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: ['index.html', 'ui/app/*.html']
  }
};
