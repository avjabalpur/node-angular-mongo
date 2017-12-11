(function () {
    'use strict';

    angular
        .module('app.service',[])
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $document, $socket) {

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
        var notificationEvent = $rootScope.$on('$notification', function (env, data) {
            alert(1);
            // check code in data
            // if (!_.isUndefined(data.code)) {
            //   msApi.resolve('main.notificationMsg@get')
            //     .then(function(res) {
            //       if (!_.isUndefined(res.data[data.code])) {
            //         // merge the notification message data to notify schema
            //         _.extend($scope.notifySchema, res.data[data.code]);
            //         // check event data is set
            //         if (!_.isUndefined(data.data)) {
            //           // merge event data to schema
            //           _.extend($scope.notifySchema, data);
            //           $rootScope.$log.info('notification message data');
            //           $rootScope.$log.info($scope.notifySchema);
            //           // pass the final notifySchema data to socket to save notification in server
            //           $socket.emit('notification', $scope.notifySchema, function() { $rootScope.$log.info('emitted notification message'); });
            //         }
            //       }
            //     });
            // }
        });

        $rootScope.$on('$destroy', function () {
            notificationEvent;
        });
    }

})();