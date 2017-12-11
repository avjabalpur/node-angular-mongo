(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'toastr'];
    function RegisterController(UserService, $location, $rootScope, toastr) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        toastr.warning(response.message.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})(window.angular);
