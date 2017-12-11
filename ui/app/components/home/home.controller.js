(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['DataService', '$rootScope'];

    function HomeController(DataService, $rootScope) {
        var vm = this;

        vm.Projects = [];
        vm.allUsers = [];
        vm.AllBoards = [];

        initController();

        function initController() {
            getallProjects();
            getAllProjectCats();
            getAllUsersByProject();
            getAllBoards();
        }

        function getallProjects() {
            DataService.getallProjects($rootScope.globals.currentUser.username)
                .then(function (res) {
                    vm.Projects = res.data;
                });
        }

        function getAllProjectCats() {
            DataService.jirausers()
                .then(function (res) {
                    vm.allUsers = res.data;
                });
        }

        function getAllUsersByProject(ProjectKey) {
            if (!ProjectKey) {
                return;
            }
            if (!ProjectKey && vm.Projects) {
                ProjectKey = vm.Projects.length > 0 ? vm.Projects[0].key : null;
            }
            if (!ProjectKey) {
                alert("please select the project first to see users");
                return;
            }
            var data = {
                project: ProjectKey
            };
            DataService.getAllUsersByProject(data)
                .then(function (res) {
                    vm.AllUsersByProject = res.data;
                });
        }

        function getAllIssuesByProject(ProjectKey) {
            if (!ProjectKey) {
                return;
            }
            if (!ProjectKey && vm.Projects) {
                ProjectKey = vm.Projects.length > 0 ? vm.Projects[0].key : null;
            }
            if (!ProjectKey) {
                alert("please select the project first to see users");
                return;
            }
            var data = {
                project: ProjectKey
            };
            DataService.getAllIssuesByProject(data)
                .then(function (res) {
                    vm.AllIssuesByProject = res.data.issues;
                });
        }

        function getAllBoards() {
            DataService.getAllBoards()
                .then(function (res) {
                    vm.AllBoards = res.data.values;
                });
        }

        function calldata(key) {
            vm.getUsers(key);
            vm.allIssues(key);

        }



        vm.getUsers = getAllUsersByProject;
        vm.allIssues = getAllIssuesByProject;
        vm.getAllBoards = getAllBoards;
        vm.calldata = calldata;
    }

})();