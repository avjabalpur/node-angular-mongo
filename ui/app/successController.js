angular.module('app').controller("successController", ["$http", "$routeParams", "DataService", "$scope",
    function ($http, $routeParams, DataService, $scope) {
        var vm = this;
        vm.text = "success";
        $scope.model =   [];
      
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