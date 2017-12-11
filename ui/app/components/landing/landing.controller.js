(function (angular) {
	'use strict';

	angular.module('app').controller('landingCtrl', landingCtrl);

	landingCtrl.$inject = ['$scope', '$state', '$rootScope', 'AuthenticationService', "api", '$socket'];

	function landingCtrl($scope, $state, $rootScope, AuthenticationService, api, $socket) {
		var vm = this;
		vm.user = {};

		$scope.notifySchema = {
			code: '', //
			key: '', // Auth|Project|Purchase
			name: '', // Login
			type: '', // enum [success, error, warning, info]
			from: {
				orgId: null, //$localStorage.mkCurrentOrganisation,
				pjtId: null, //$localStorage.mkCurrentProject,
				userId: null, //$localStorage.mkCurrentUser,
				userType: null, //$localStorage.mkCurrentUserType
			}, // will have orgId, pjtId, userId, userType
			to: {
				orgId: null, //$localStorage.mkCurrentOrganisation,
				pjtId: null, //$localStorage.mkCurrentProject,
				userId: null, //$localStorage.mkCurrentUser,
				userType: null, //$localStorage.mkCurrentUserType
			}, // will have org_id, pjt_id, user_id, userType
			title: '', // notification title mandatory
			message: {
				notify: null, // notification message
				alert: null, // alert message
				activity: null // activity message
			},
			data: {}, // will have _id & name
			notifyFlag: false, // true to sent as notification (to user)
			alertFlag: false, // true to sent as alert (to user)
			activityFlag: false, // true to set as activity (from user)
			sentFlag: false,
			viewFlag: false,
			deleteFlag: false,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		// Remove the splash screen
		$scope.$on('$viewContentAnimationEnded', function (event) {
			// if(event.targetScope.$id === $scope.$id) {
			//   $rootScope.$broadcast('msSplashScreen::remove');
			// }
		});

		$rootScope.showMessage = function (opt, $event) {
			// return $mdDialog.show(
			//   $mdDialog.alert()
			//     .parent(angular.element($document.body))
			//     .clickOutsideToClose(true)
			//     .title(opt.title || 'Warning')
			//     .textContent(opt.message || 'Something went wrong, try again!')
			//     .ariaLabel(opt.title || 'Warning')
			//     .ok(opt.button || 'Close')
			//     .targetEvent($event)
			// );
		}

		/**
		 * Notification
		 */
		var notificationEvent = $rootScope.$on('$notification', function (env, data, callback) {

			//$socket
			// merge event data to schema
			_.extend($scope.notifySchema, data);
			$rootScope.$log.info('notification message data');
			$rootScope.$log.info($scope.notifySchema);
			// pass the final notifySchema data to socket to save notification in server
			$socket.emit('notification', $scope.notifySchema, function (notification) {
				$rootScope.$log.info('emitted notification message');
				$rootScope.$broadcast('pushNotificationReceived', notification); 
				callback(notification);
			});
		});

		$rootScope.$on('$destroy', function () {
			notificationEvent;
		});

		vm.logout = function () {
			AuthenticationService.ClearCredentials();
			//api.auth.logout.get();
			$state.go('basic.home');
		};


		vm.init = function () {
			vm.user = AuthenticationService.GetLogedinUser();
			vm.currentpage = $state.current.display_name;
			$rootScope.$on('$stateChangeStart', function (e, toState, currentState) {
				vm.currentpage = toState.display_name;
			});
		};

	}

})(window.angular);