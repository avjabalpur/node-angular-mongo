
(function () {
    'use strict';

    function JiraCallbackController($http, $location, $cookieStore, $window, api, $state) {
        var vm = this;
        function sublitReq() {
            var oauth_token = $location.$$search.oauth_token;
            var oauth_verifier = $location.$$search.oauth_verifier;
            var data = { oauth_token: oauth_token, oauth_verifier: oauth_verifier };
            var authHeader = $cookieStore.get('globals');
            var config = {};
            api.tracker.callback.save(data).$promise.then(function (data, error) {
                $state.go('app.dashboard');
            });
        }
        sublitReq();
    }

    JiraCallbackController.$inject = ["$http", "$location", "$cookieStore", "$window", "api", "$state"];
    angular.module('app').controller('JiraCallbackController', JiraCallbackController);
})();