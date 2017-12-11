var app = angular.module('app');

app.factory('commonSvc', ['$timeout', 'dialogs', 'api', '$q', 'toastr', function ($timeout, dialogs, api, $q, toastr) {
    var svc = {};

    svc.createDataTable = function (id, obj) {
        if ($.fn.DataTable.isDataTable(id)) {
            $(id).dataTable().fnClearTable();
            $(id).dataTable().fnDestroy();
        }
        $timeout(function () {
            $(id).dataTable(_.extend({
                "bJQueryUI": true,
                "sPaginationType": "full_numbers",
            }, obj));
        }, 50);
    }

    return svc;
}]);