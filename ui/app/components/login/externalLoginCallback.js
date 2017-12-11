(function () {
    'use strict';

    function externalLoginCallback($scope, $timeout, $state, $cookies, $location,api) {
        var vm = this;
        function sublitReq() {
            var oauth_token = $location.$$search.oauth_token;
            var oauth_user = $location.$$search.oauth_user;
            var data = { authdata: oauth_token, username: oauth_user };
            var authHeader = $cookies.getObject('globals');
            var config = {};
            $cookies.putObject('globals', {
                currentUser: data
            });

            $state.go("app.dashboard");
        }
        sublitReq();
    }
    externalLoginCallback.$inject = ["$scope", "$timeout", "$state", "$cookies", "$location","api"];
    angular.module('app').controller('externalLoginCallback', externalLoginCallback);
})();
