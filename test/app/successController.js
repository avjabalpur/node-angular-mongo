angular.module('myApp').controller("successController", ["$http", "$routeParams", "DataService",
    function ($http, $routeParams, DataService) {
        var vm = this;
        vm.text = "success";

        function GetMyself() {
            DataService.getMyself().then(function (results) {
                vm.text = results.data.data;
            }, function (error) {
                vm.text = error;
            });
        }
        function GetAllProjects() {
            DataService.getAllProjects().then(function (results) {
                vm.text = results.data.data;
            }, function (error) {
                vm.text = error;
            });
        }

        vm.getAllProjects = GetAllProjects;
        vm.getMyself = GetMyself;

    }
]);