var app = angular.module('myApp', ['ngCookies', 'ngRoute']);
app.config(function ($routeProvider,$locationProvider) { 
    
    // $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $routeProvider
        .when("/", {
            templateUrl: "test.html",
            controller: "testController as vm" 
        })
        .when("/callback", {
            templateUrl: "callback.html",
            controller: "callbackController"
        })
        .when("/success", {
            templateUrl: "success.html",
            controller: "successController as vm" 
        });
          // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
});

app.run(['$location', function AppRun($location) {
    //debugger; // -->> here i debug the $location object to see what angular see's as URL
}]);