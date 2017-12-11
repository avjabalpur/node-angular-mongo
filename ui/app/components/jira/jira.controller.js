
(function () {
    'use strict';
    function jiraController(jiraService, $scope, $cookies, $cookieStore, $window) {
        var vm = this;
        $scope.tab = 1;
        vm.allProjects = [];
        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };
        $scope.idSelectedproject = null;
        $scope.setSelected = function (idSelectedproject) {
            $scope.idSelectedproject = idSelectedproject;
        };
        function getProjects() {
            jiraService.getallProjects()
                .then(function (results) {
                    if (results)
                        vm.allProjects = results.data;
                    else
                        alert("Please make sure that you already connected with jira account");

                    if (vm.allProjects.length > 0)
                        $scope.idSelectedproject = vm.allProjects[0].key;
                }, function (error) {
                    console.log(error);
                })
                .finally(function () {

                });
        }
        function jiraConnect() {
            jiraService.jiraConnect(vm.jira)
                .then(function (results) {
                    vm.jirausers = results;
                    $window.location.href = results.data;
                }, function (error) { })
                .finally(function () {

                });
        }
        function loadJiraUsers() {
            if ($scope.idSelectedproject) {
                var project = {
                    project: $scope.idSelectedproject
                }
                jiraService.jirausers(project)
                    .then(function (results) {
                        vm.jirausers = results.data;
                    }, function (error) {
                        console.log(error);
                    })
                    .finally(function () {

                    });
            } else {
                alert('Please select a project First!!');
            }
        }


        function getIssues() {
            if ($scope.idSelectedproject) {
                var project = {
                    project: $scope.idSelectedproject
                }
                jiraService.getAllIssuesByProject(project)
                    .then(function (results) {
                        vm.allIssues = results.data;
                    }, function (error) {
                        console.log(error);
                    })
                    .finally(function () {

                    });
            }
            else {
                alert('Please select a project First!!');
            }
        }
        function getAllBoards() {
            if ($scope.idSelectedproject) {
                var project = {
                    project: $scope.idSelectedproject
                }
                jiraService.getAllBoards(project)
                    .then(function (results) {
                        vm.allBoards = results.data;
                    }, function (error) {
                        console.log(error);
                    })
                    .finally(function () {

                    });
            }
            else {
                alert('Please select a project First!!');
            }
        }
        function getissueDetail(issuekey) {
            var data = { issuekey: issuekey };
            jiraService.getIssueById(data)
                .then(function (results) {
                    vm.allIssues.issues.forEach(function (k, v) {
                        if (k.key === issuekey)
                            k.details = results.data.fields
                    });

                }, function (error) {
                    console.log(error);
                })
                .finally(function () {

                });

        }
        vm.getProjects = getProjects;
        vm.Connect = jiraConnect;
        vm.loadJiraUsers = loadJiraUsers;
        vm.getIssues = getIssues;
        vm.getAllBoards = getAllBoards;
        vm.getissueDetail = getissueDetail;
        // vm.login = login;
    }

    jiraController.$inject = ['jiraService', '$scope', '$cookies', '$cookieStore', '$window'];
    angular.module('app').controller('jiraController', jiraController)
})();;