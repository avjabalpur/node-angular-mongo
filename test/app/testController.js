angular.module('myApp').controller('testController', ['DataService', '$scope', '$cookies', '$cookieStore','$window',
    function (DataService, $scope, $cookies, $cookieStore,$window) {
        
        var vm = this;
        vm.IsLoggedin = false;
        vm.logindata = {};
        vm.logindata.username = "amtkrsgr";
        vm.logindata.password = "123456";
        vm.logindata.rememberMe = true;
        function login() {
            DataService.login(vm.logindata)
                .then(function (results) {
                    vm.data = results;
                    vm.IsLoggedin = true;
                    $cookieStore.put('logindata', results.data);
                }, function (error) { vm.IsLoggedin = false; })
                .finally(function () {

                });
        }
        function loadJiraUsers() {
            DataService.jirausers()
                .then(function (results) {
                    vm.jirausers = results;
                }, function (error) { })
                .finally(function () {

                });
        }
        function jiraConnect() {
            DataService.jiraConnect('mykey')
                .then(function (results) {
                    vm.jirausers = results;
                    $window.location.href=results.data.data;
                }, function (error) { })
                .finally(function () {

                });
        }
 
        vm.jiraConnect = jiraConnect;
        vm.loadJiraUsers = loadJiraUsers;
        vm.login = login;
    }
]);