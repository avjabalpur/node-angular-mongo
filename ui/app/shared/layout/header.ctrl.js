(function (angular) {
    'use strict';

		angular.module('app').controller('headerCtrl', function ($scope, $rootScope,authFactory,UserSrv,$state) {

		var vm = this;
		vm.user = {};
		
		$rootScope.logout = function(){
			authFactory.logout();
			$state.go('basic.home');
		};
		
		vm.init = function(){
			UserSrv.get().then(function(user){
				vm.user = user;
			});
		};	
	});


})(window.angular);