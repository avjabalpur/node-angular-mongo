(function (app) {
    'use strict';

    var configure = ['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('app', {
                cache: true,
                abstract: true,
                views: {
                    '': {
                        templateUrl: 'content/app/components/landing/landing.html',
                        controller: 'landingCtrl as $land',
                    }                     
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('app');
                    }]
                }
            })
            .state('app.dashboard', {
                display_name: 'Dashboard',
                url: '/dashboard',
                cache: true,
                views: {
                    'pageContent': {
                        templateUrl: 'content/app/components/dashboard/dashboard.html',
                        controller: 'dashboardCtrl as $dash'
                    }
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('dashboard');
                    }]
                }
            })
            .state('app.jiraConnect', {
                display_name: 'jira Connect',
                url: '/jiraConnect',
                cache: true,
                views: {
                    'pageContent': {
                        templateUrl: 'content/app/components/jira/jira.connect.view.html',
                        controller: 'jiraController as $jira'
                    }
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('jiraConnect');
                    }]
                }
            }).state('app.jira', {
                display_name: 'JIRA Project Details',
                url: '/jira',
                cache: true,
                views: {
                    'pageContent': {
                        templateUrl: 'content/app/components/jira/projects.view.html',
                        controller: 'jiraController as $jira'
                    }
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('jira');
                    }]
                }
            });

        $stateProvider
            .state('basic', {
                cache: true,
                views: {
                    '': {
                        templateUrl: 'content/app/components/landing/basicLanding.html'
                    }
                    /*,
                                    'header@basic': {
                                        templateUrl: 'content/app/shared/layout/basicHeader.html',
                                        controller: 'basicHeaderCtrl as $header'
                                    },
                                    'footer@basic': {
                                        templateUrl: 'content/app/shared/layout/basicFooter.html'
                                    },*/
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('basic');
                    }]
                }
            })
            .state('basic.home', {
                url: '/home',
                display_name: 'Home',
                cache: true,
                views: {
                    'pageContent': {
                        templateUrl: '/content/app/components/login/login.view.html',
                        controller: 'LoginController as $auth'
                    }
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('home');
                    }]
                }
            })
            .state('basic.register', {
                url: '/register',
                display_name: 'Register',
                cache: true,
                views: {
                    'pageContent': {
                        templateUrl: '/content/app/components/register/register.view.html',
                        controller: 'RegisterController as $reg'
                    }
                },
                resolve: {
                    jsLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('register');
                    }]
                }
            })
            .state('basic.externalLoginCallback', {
                url: '/externalLoginCallback',
                display_name: 'Callback',
                cache: true,
                views: {
                    'pageContent': {
                        template: '<div>Please wait!!</div>',
                        controller: 'externalLoginCallback as $excallback'
                    }
                }
            })
            .state('loading', {
                url: '/loading',
                cache: false,
                template: '<div ng-init="vm.redirect()"></div>',
                controller: 'LoadingCtrl'
            })
            .state('jiraCallback', {
                url: '/jiraCallback',
                cache: true,
                templateUrl: 'content/app/components/jira/jira.callback.view.html',
                controller: 'JiraCallbackController as $jcallback',
                params: {
                    oauth_token: null,
                    oauth_verifier: null
                }
            });

    }];

    var run = ['$rootScope', '$state', '$urlRouter', '$timeout', '$cookieStore', function ($rootScope, $state, $urlRouter, $timeout, $cookieStore) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (fromState.url == toState.url) {
                event.preventDefault();
            }
            if ($cookieStore.get('globals')) {
                if (toState.name === 'basic.home') {
                    event.preventDefault();
                    $state.go('loading');
                }
            } else {
                if (toState.name.indexOf('basic') == -1) {
                    event.preventDefault();
                    $state.go('basic.home');
                }
            }
        });
    }];
    angular.module('app').run(run);
    angular.module('app').config(configure);
})(window.app);