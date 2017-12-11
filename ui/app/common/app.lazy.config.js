(function (angular) {
    'use strict';

    /* module js files to be mentioned here for load when module loads */
    var modules = [
        {
            name: 'app',
            serie: true,
            cache: true,
            files: [
                'content/app/app-services/authentication.service.js',
                'content/app/components/landing/landing.controller.js', 
                'content/app/app-services/socket.provider.js'
                
            ]
        },
        {
            name: 'dashboard',
            serie: true,
            cache: true,
            files: [
                'content/app/components/dashboard/dashboard.controller.js',
                'content/app/components/dashboard/dashboard.service.js' 
            ]
        },
        {
            name: 'jiraConnect',
            serie: true,
            cache: true,
            files: [
                'content/app/components/jira/jira.controller.js',
                'content/app/app-services/jiraService.js'
            ]
        },{
            name: 'jira',
            serie: true,
            cache: true,
            files: [                
                'content/app/components/jira/jira.controller.js',
                'content/app/app-services/jiraService.js'
                
            ]
        },
        {
            name: 'jiraCallback',
            serie: true,
            cache: true,
            files: [                
                'content/app/components/jira/jira.callback.controller.js',
                'content/app/app-services/jiraService.js'
                
            ]
        },

        {
            name: 'basic',
            serie: true,
            cache: true,
            files: [
                'content/app/shared/layout/basicHeader.controller.js',
                "content/app/components/login/login.controller.js",
                "content/app/app-services/authentication.service.js",
                "content/app/app-services/user.service.js",
                "content/app/app-services/flash.service.js"  
                
            ]
        },
        {
            name: 'home',
            serie: true,
            cache: true,
            files: [
                'content/app/components/home/home.controller.js'
            ]
        },
        {
            name: 'register',
            serie: true,
            cache: true,
            files: [
                'content/app/components/register/register.controller.js'
            ]
        }
        // #===== lazy config=====#

    ];

    /* return modules to lazy config with all modification done to modules object (if required) */
    function getModules(cfg) {
        if (_.get(cfg, 'useMinFiles') == true) {
            return getMiniFiles(modules);
        }
        return modules;
    };

    function getMiniFiles(moduleArray) {
        /* TODO: have to write logic to point .min files
         * Logic will be to iterate throughout the modules array and change files array in side it to point [moduleName].min.js
         * [moduleName].min.js will be a merged file of all the js files required specifically for module which will be created by grunt task
         * */
        return moduleArray;
    };

    /* lazy load config */
    lazyConfig.$inject = ['$ocLazyLoadProvider'];

    function lazyConfig($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: getModules({
                useMinFiles: true
            })
        });
    };

    angular.module('app').config(lazyConfig);

}(window.angular));










