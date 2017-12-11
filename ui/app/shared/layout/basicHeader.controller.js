(function (angular) {
    'use strict';

	angular.module('app').controller('basicHeaderCtrl', 
	function ($scope,$uibModal, $state,authFactory,toastr) {

		var vm = this;
    vm.user ={};

    vm.openComponentModal = function () {
          var modalInstance = $uibModal.open({
              component: 'modalComponent',
              resolve: {
                  items: function () {
                      return '';
                  }
              }
          });

          /*modalInstance.result.then(function (selectedItem) {
              $ctrl.selected = selectedItem;
          }, function () {
              $log.info('modal-component dismissed at: ' + new Date());
          });*/
    };



    vm.login = function () {
      vm.user.socialMediaType ='0';
      authFactory.login(vm.user).then(function(res){
        $state.go('loading')
          return res;
      },
      function(err){
          toastr.error(err, 'Error');
          return err;
      });
    };
		
	});


})(window.angular);