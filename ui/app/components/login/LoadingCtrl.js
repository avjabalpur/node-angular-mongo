(function(){
  'use strict';
  angular.module('app')
    .controller('LoadingCtrl', LoadingCtrl);

  function LoadingCtrl($scope,$timeout,$state,$cookieStore){
    var vm = {};
    $scope.vm = vm;
    $scope.vm.redirect = redirect;

   
    function redirect(){
      $timeout(function(){
        if($cookieStore.get('globals')){
          $state.go('app.dashboard');
        } else {
          $state.go('basic.home');
        }
      }, 300);
    }
  }
})();