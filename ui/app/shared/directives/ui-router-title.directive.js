 (function (angular) {
    'use strict';
       angular.module('app').directive('updateTitle', ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
          return {
            link: function(scope, element) {

              var listener = function(event, toState) {

                $timeout(function() {
                  element.text(_.concat(_.get(toState, 'display_name'), ' - Fantasy League' ).join(''));
                }, 0, false);
              };

              $rootScope.$on('$stateChangeSuccess', listener);
            },
            scope: {},
            restrict: 'A'
          };
        }
      ]);
})(window.angular);