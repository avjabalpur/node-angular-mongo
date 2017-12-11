(function () {
    'use strict';
    function jiraService($q, $timeout, $http, $cookies, $cookieStore, api) {
        return {
            login: function (logindata) {
                return api.tracker.signin.save(logindata).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });
            },
            jirausers: function (project) {
                return api.tracker.getAllUsersByProject.save(project).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });

            },
            getMyself: function () {
                return api.tracker.myself.get().$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });
            },
            getallProjects: function () {
                return api.tracker.getAllProjects.get().$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });
            },
            jiraConnect: function (data) {
                return api.tracker.jiraConnect.save(data).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });
            },
            getAllUsersByProject: function (data) {
                return api.tracker.getAllUsersByProject.save(data).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });

            },
            getAllIssuesByProject: function (data) {
                return api.tracker.getAllIssuesByProject.save(data).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });

            },
            getAllBoards: function (data) {
                return api.tracker.getAllBoards.save(data).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                });

            },
            getIssueById: function (data) {
                return api.tracker.getIssueById.save(data).$promise.then(function (res, error) {
                    if (error) {
                        console.log(error);
                    }
                    return res.response;
                }); 
            }
        }
    }
    jiraService.$inject = ['$q', '$timeout', '$http', '$cookies', '$cookieStore', 'api'];
    angular.module('app').factory('jiraService', jiraService);
})();