(function () {
    'use strict';


    function LoginController($location, AuthenticationService, toastr, $rootScope, $state, $remember, $scope) {
        var vm = this;

        function initController() {
            // reset login status
            vm.rememberMe = false;
            if ($remember('username') && $remember('password')) {
                $scope.remember = true;
                vm.username = $remember('username');
                vm.password = $remember('password');
            }
            $scope.rememberMe = function () {
                if (vm.rememberMe) {
                    $remember('username', vm.username);
                    $remember('password', vm.password);
                } else {
                    $remember('username', '');
                    $remember('password', '');
                }
            };
            AuthenticationService.ClearCredentials();
            $rootScope.IsloggedIn = false;
        }



        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, vm.rememberMe).then(function (response) {
                if (response.result == 'success') {
                    AuthenticationService.SetCredentials(response.token, vm.username);
                    $state.go('app.dashboard');
                } else {
                    toastr.error(response.error.message);
                    vm.dataLoading = false;
                }
            }, function (err) {
                toastr.error(err.error.message);
                vm.dataLoading = false;
            });
        }

        function loginWithGoogle() {
            vm.dataLoading = true;
            AuthenticationService.GoogleLogin().then(function (response) {
                if (response.result == 'success') {
                    //AuthenticationService.SetCredentials(response.token, vm.username);
                    // $state.go('app.dashboard');
                } else {
                    toastr.error(response.error.message);
                    vm.dataLoading = false;
                }
            });
        }

        function loginWithFacebook() {
            vm.dataLoading = true;


            AuthenticationService.facebookLogin().then(function (response) {
                if (response.result == 'success') {
                    //AuthenticationService.SetCredentials(response.token, vm.username);
                    //$state.go('app.dashboard');
                } else {
                    toastr.error(response.error.message);
                    vm.dataLoading = false;
                }
            });
        }

        vm.login = login;
        vm.loginWithGoogle = loginWithGoogle;
        vm.loginWithFacebook = loginWithFacebook;

        initController();
    }

    LoginController.$inject = ['$location', 'AuthenticationService', 'toastr', '$rootScope', '$state', '$remember', '$scope'];
    angular.module('app').controller('LoginController', LoginController);
})();