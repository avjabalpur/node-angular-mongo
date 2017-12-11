(function () {
    'use strict';

    angular.module('app').controller('dashboardCtrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$scope', 'toastr', '$rootScope', 'api'];

    function dashboardCtrl($scope, toastr, $rootScope, api) {

        var vm = this;
        vm.keepLoading = true;
        $scope.emitBasic = function emitBasic() {
            console.log('echo event emited');
            // socket.emit('echo', $scope.dataToSend);
            var notification = {
                code: "MSG002",
                key: "Test",
                name: "notification",
                type: "notify",
                from: {
                    orgId: undefined,
                    pjtId: undefined,
                    userId: undefined,
                    userType: "jira"
                },
                to: {
                    orgId: undefined,
                    pjtId: undefined,
                    userId: undefined,
                    userType: "jira"
                },
                title: "notification",
                message: {
                    notify: "notify",
                    alert: "alert",
                    activity: "activity",
                },
                notifyFlag: true,
                alertFlag: true,
                activityFlag: true,
                data: {
                    data: "sdfkljfjsfjkjfkjsdkfjsdkkldklfkl skljfksd"
                },
                sentFlag: false,
                viewFlag: false,
                deleteFlag: false,
                createdBy: undefined,
                updatedBy: undefined,
            };

            $rootScope.$emit('$notification', notification, function (data) {
                alert("notification: callback Notification Received");
            });

            $rootScope.dataToSend = '';
        };
        $rootScope.$on('pushNotificationReceived', function (event, notification) {
            getNotifications()
            alert("notification: push Notification Received")
        });

        function getNotifications() {
            api.notifications.get().$promise.then(function (data) {
                $scope.notifications = [data.data.activities, data.data.alerts, data.data.notifications];
            });
        }

        function init() {
            $scope.notifications = [];
            getNotifications();
        };
        init();
        //   toastr.info('We are open today from 10 to 22', 'Information');
        /*toastr.success('Hello world!', 'Toastr fun!');
        toastr.error('Your credentials are gone', 'Error');
        toastr.warning('Your computer is about to explode!', 'Warning');
        toastr.success('I don\'t need a title to live');*/
    }


})();