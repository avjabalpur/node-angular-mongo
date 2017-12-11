angular.module('myApp').factory("DataService", ['$q', '$timeout', '$http', '$cookies', '$cookieStore',
    function ($q, $timeout, $http, $cookies, $cookieStore) {
        return {
            login: function (logindata) {
                return $http({
                    url: 'http://localhost:5000/api/v1/auth/signin',
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: logindata
                }).success(function (data, status, headers, config) {
                    console.log("Success!");
                    return data;
                }).error(function (data, status, headers, config) {
                    console.log("Error.");
                });
            },
            jirausers: function () {
                var authHeader = $cookieStore.get('logindata');
                return $http({
                    url: "http://localhost:5000/api/v1/jira/jirausers",
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + authHeader.token
                    }
                }).success(function (data, status, headers, config) {
                    console.log("Success!");
                    return data;
                }).error(function (data, status, headers, config) {
                    console.log("Error.", data);
                });
            },
            getMyself: function () {
                var authHeader = $cookieStore.get('logindata');
                return $http({
                    url: 'http://localhost:5000/api/v1/jira/myself',
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + authHeader.token
                    }
                }).then(function onSuccess(data, status, headers, configres) {
                    console.log("Success!");
                    return data;
                }, function onError(data, status, headers, config) {
                    console.log("Error.", data);
                });
            },
            getAllProjects: function () {
                var authHeader = $cookieStore.get('logindata');
                return $http({
                    url: 'http://localhost:5000/api/v1/jira/getAllProjects',
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + authHeader.token
                    }
                }).then(function onSuccess(data, status, headers, configres) {
                    console.log("Success!");
                    return data;
                }, function onError(data, status, headers, config) {
                    console.log("Error.", data);
                });
            },
            jiraConnect: function (data) {
                var authHeader = $cookieStore.get('logindata');
                return $http({
                    url: "http://localhost:5000/api/v1/jira/jiraConnect?consumer_key=" + data,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + authHeader.token
                    }
                }).success(function (data, status, headers, config) {
                    console.log("Success!");
                    return data;
                }).error(function (data, status, headers, config) {
                    console.log("Error.", data);
                });
            }
        }
    }
]);