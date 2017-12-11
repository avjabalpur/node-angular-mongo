angular.module('myApp').controller("callbackController", ["$http", "$routeParams", "$cookieStore","$window",
    function ($http, $routeParams, $cookieStore, $window) {
        var vm = this;
        function sublitReq() {
            var oauth_token = $routeParams.oauth_token;
            var oauth_verifier = $routeParams.oauth_verifier;
            var data = { oauth_token: oauth_token, oauth_verifier: oauth_verifier };
            var authHeader = $cookieStore.get('logindata');
            var config = {};
            $http({
                url: 'http://localhost:5000/api/v1/jira/jiraConnect/callback',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + authHeader.token
                }
            }).then(function onSuccess(res) {
                console.log(res);
                $window.location.href = "#/success";
            }, function onError(err) {
                console.log(err);
            });
        }
        sublitReq();


    }
]);