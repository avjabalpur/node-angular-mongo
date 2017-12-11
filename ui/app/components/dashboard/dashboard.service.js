(function(angular) {
    'use strict';

    angular.module('app')
        .service('dashboardService', dashboardService)
        .factory('dashboardFactory', dashboardFactory);

    dashboardService.$inject = [];
    dashboardFactory.$inject = ["api", 'StorageUtils', '$http', "dashboardService"];

    function dashboardService() {
        this.item = {};
    };

    function dashboardFactory(api, StorageUtils, $http, dashboardService) {
       
        return {
           

        };


        
    };

})(window.angular);