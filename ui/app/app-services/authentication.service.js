(function () {
    'use strict';

    function AuthenticationService($http, $cookies, $rootScope, $timeout, api) {
        var service = {};

        function Login(username, password, rememberMe) {
            var reqObj = {
                username: username,
                password: password,
                rememberMe: rememberMe
            };
            return api.auth.login.save(reqObj).$promise.then(function (res) {
                return res;
            }, function (error) {
                return error.data;
            });
        }

        function googleLogin() {
            return api.auth.go.save().$promise.then(function (res) {
                return res;
            }, function (error) {
                return error.data;
            });
        }

        function facebookLogin() {
            return api.auth.fb.get().$promise.then(function (res) {
                return res;
            }, function (error) {
                return error.data;
            });
        }

        function SetCredentials(token, username) {
            var authdata = token;
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'bearer ' + authdata;

            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookies.putObject('globals', $rootScope.globals, {
                expires: cookieExp
            });
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'bearer';
        }

        function isLiggedInn() {
            var global = $cookies.getObject('globals');
            if (global) {
                return global.currentUser != null;
            }
            return false;
        }

        function getLogedinUser() {
            var global = $cookies.getObject('globals');
            if (global) {
                return global.currentUser
            }
            return null;
        }



        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.IsLiggedInn = isLiggedInn;
        service.GetLogedinUser = getLogedinUser;
        service.GoogleLogin = googleLogin;
        service.facebookLogin = facebookLogin;
        return service;
    }
    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'api'];
    angular.module('app').factory('AuthenticationService', AuthenticationService)
        .factory('$remember', function () {
            function fetchValue(name) {
                var gCookieVal = document.cookie.split("; ");
                for (var i = 0; i < gCookieVal.length; i++) {
                    // a name/value pair (a crumb) is separated by an equal sign
                    var gCrumb = gCookieVal[i].split("=");
                    if (name === gCrumb[0]) {
                        var value = '';
                        try {
                            value = angular.fromJson(gCrumb[1]);
                        } catch (e) {
                            value = unescape(gCrumb[1]);
                        }
                        return value;
                    }
                }
                // a cookie with the requested name does not exist
                return null;
            }
            return function (name, values) {
                if (arguments.length === 1) return fetchValue(name);
                var cookie = name + '=';
                if (typeof values === 'object') {
                    var expires = '';
                    cookie += (typeof values.value === 'object') ? angular.toJson(values.value) + ';' : values.value + ';';
                    if (values.expires) {
                        var date = new Date();
                        date.setTime(date.getTime() + (values.expires * 24 * 60 * 60 * 1000));
                        expires = date.toGMTString();
                    }
                    cookie += (!values.session) ? 'expires=' + expires + ';' : '';
                    cookie += (values.path) ? 'path=' + values.path + ';' : '';
                    cookie += (values.secure) ? 'secure;' : '';
                } else {
                    cookie += values + ';';
                }
                document.cookie = cookie;
            }
        });

})();