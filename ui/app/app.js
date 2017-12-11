(function (app) {
    'use strict';
    var app = angular.module('app', [
        'oc.lazyLoad',
        'ui.bootstrap',
        'dialogs.main',
        'pascalprecht.translate',
        'ngSanitize',
        'dialogs.default-translations',
        /*'dialogs.main',
        'dialogs.default-translations',*/
        'ui.router',
        'ui.router.state.events',
        'ngResource',
        'toastr',
        'ngCookies'
    ]);

    app.config(configure).run(runBlock);

    app.service('__key', function () {
        this.assign = key.noConflict();
    });

    app.constant('Config', {
        storage: true, // should save data to browser storage
        storagePrefix: '', // prefix all stoarge entries with this prefix
        //emailSupport: 'sanspoly@gmail.com',
        permissions: []
    });

    runBlock.$inject = ['$http', '$rootScope', '$sce', '$state', '$location', '$log'];

    function runBlock($http, $rootScope, $sce, $state, $location, $log) {
        $rootScope.$state = $state;
        $rootScope.$location = $location;
        $rootScope.$log = $log;
    };

    configure.$inject = ['$httpProvider', '$compileProvider', '$urlRouterProvider', 'toastrConfig'];

    function configure($httpProvider, $compileProvider, $urlRouterProvider, toastrConfig) {
        angular.extend(toastrConfig, {
            closeButton: true
        });
        var interceptor = ['$q', '$rootScope', '$cookieStore', function ($q, $rootScope, $cookieStore) {
            return {
                'request': function (config) {
                    config.headers.useXDomain = true;

                    config.headers["X-Requested-With"] = 'XMLHttpRequest';
                    config.headers['Access-Control-Allow-Origin'] = '*';
                    var globals = $cookieStore.get('globals');

                    if (globals && globals.currentUser && globals.currentUser.authdata) {
                        config.headers.Authorization = 'Bearer ' + globals.currentUser.authdata || null;
                    }
                    return config;
                },

                'requestError': function (rejection) {
                    return $q.reject(rejection);
                },

                'response': function (response) {
                    return response;
                },

                'responseError': function (rejection) {
                    if (rejection.status == 401) {
                        $rootScope.logout();
                    }
                    return $q.reject(rejection);
                }
            };
        }];
        var httpInterceptor = ['$q', '$rootScope', '$log', function ($q, $rootScope, $log) {
            var numLoadings = 0;
            return {
                request: function (config) {
                    numLoadings++;
                    // Show loader
                    $rootScope.$broadcast("loader_show");
                    return config || $q.when(config)

                },
                response: function (response) {
                    if ((--numLoadings) === 0) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide");
                    }
                    return response || $q.when(response);
                },
                responseError: function (response) {
                    if (!(--numLoadings)) {
                        // Hide loader
                        $rootScope.$broadcast("loader_hide");
                    }
                    return $q.reject(response);
                }
            };
        }];
        $httpProvider.interceptors.push(interceptor);
        //$httpProvider.interceptors.push(httpInterceptor);
        $httpProvider.useApplyAsync(true);
        $compileProvider.debugInfoEnabled(false);
        $urlRouterProvider.otherwise('/home');
        
    };
})(window.app);