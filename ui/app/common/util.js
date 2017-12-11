(function (app) {
    "use strict";

	angular.module('app').directive('includeHtml', function() { 
	    return {
			replace:true,
	        templateUrl: function(elem, attrs) { 
	            return attrs.url || '../404.html'; 
	        } 
	    } 
	})
	.filter('unique', function() {
		return function(collection, keyname) {
			var output = [], 
				keys = [];

			angular.forEach(collection, function(item) {
				var key = item[keyname];
				if(keys.indexOf(key) === -1) {
					keys.push(key);
					output.push(item);
				}
			});

			return output;
		};
	})
	.directive('convertToNumber', function() {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function(val) {
				return parseInt(val, 10);
			});
			ngModel.$formatters.push(function(val) {
				return '' + val;
			});
			}
		};
	})
	.filter('griddropdown', function () {
        return function (input, map, fieldName, idLabel, valueLabel) {
            if(map){
            	var items = _.get(_.find(map,function(field){return field.name  == fieldName}),'listItems');
				for (var i = 0; i < items.length; i++) {
					if (items[i][idLabel] == input)
					{
						return items[i][valueLabel];
					}
				}
            }
            return "";
        };
    })
    .filter('gridCheckBox', function () {
        return function (input, yesLable, noLabel) {
            return (input)? yesLable:noLabel;
        };
    })
	.directive('dragInterceptor',['$window','$timeout', function(win,$timeout) {
        return {
            restrict: 'A',
            scope:{},
            bindToController:{
                execLocation: '='
            },
            controllerAs:'vm',
            controller:function dragCtrl(){},
            link:function(s,e,a,n){
				
				e.bind("mousedown", function(p){
					var n = e.data().$dragInterceptorController;
					// bind functions
					if(a.ondrop){
						onDropEvent(n);
					}
					if(a.ondragover){
						onDragOverEvent(n);
					}
					if(a.ondragstart){
						onDragStartEvent(n);
					}
				});

                // enables dragging
                e.attr('draggable', true);

				function onDropEvent(n){
					win[a.ondrop.split('(')[0]] = function(ev){
						ev.preventDefault();
						// $evalAsync is better alternative for timeout when it comes to digestion purpose
						// replace it with $timeout if doesn't work.
						s.$evalAsync(function(){ n.execLocation[a.ondrop.split('(')[0]](ev, win.dragSrcEv);});
					};
				};

				function onDragOverEvent(n){
					win[a.ondragover.split('(')[0]] = function(ev){
						ev.preventDefault();
						// $evalAsync is better alternative for timeout when it comes to digestion purpose
						// replace it with $timeout if doesn't work.
						s.$evalAsync(function(){n.execLocation[a.ondragover.split('(')[0]](ev);});
					};
				};

				function onDragStartEvent(n){
					win[a.ondragstart.split('(')[0]] = function(ev){
						// $evalAsync is better alternative for timeout when it comes to digestion purpose
						// replace it with $timeout if doesn't work.
						win.dragSrcEv = ev;
						s.$evalAsync(function(){n.execLocation[a.ondragstart.split('(')[0]](ev);});
					};
				};
				
            }
        }
    }])
	.directive("scroll", function ($window) {
	    return function(scope, element, attrs) {
	        angular.element($window).bind("scroll", function() {
	             if (this.pageYOffset >= 100) {
	                 scope.boolChangeClass = true;
	             } else {
	                 scope.boolChangeClass = false;
	             }
	            scope.$apply();
	        });
	    };
	})

	.directive("loader", function ($rootScope) {
		return function ($scope, element, attrs) {
			$scope.$on("loader_show", function () {
				return element.show();
			});
			return $scope.$on("loader_hide", function () {
				return element.hide();
			});
		};
	})

	.directive('focusItem', ['$timeout', function($timeout) {
		return {
			link: function(scope, element, attrs) {
				scope.$watch(attrs.focusItem, function() {
					$timeout(function() {
						if(element.hasClass("selected")){
							element[0].focus();
						}
					}, 100);
				});
			}
		};
	}])
	
	.directive('confirmDialogModal', function(){
		return {
			link: function($scope, $element, $attrs, $controller){
				$element.hide();
				$scope.$watch($attrs.when, function(show) {
					if(show){
						$scope.name = $attrs.name;
						$scope.remove = function(){
							$scope.$eval($attrs.remove);
						};
						$modal = $($templateCache.get('confirm-dialog-modal.html')).modal();
						$modal.modal('show');
					} else {
						if($modal){
							$modal.modal('hide');                    
						}                
					}
				});
			}
		};
	})

	.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                       scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
	})

	.filter('setDecimal', function ($filter) {
		return function (input, places) {
			if (isNaN(input)) return input;
			// If we want 1 decimal place, we want to mult/div by 10
			// If we want 2 decimal places, we want to mult/div by 100, etc
			// So use the following to create that factor
			var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
			return Math.round(input * factor) / factor;
		};
	})

	.directive('xcdInsert', function () {
		return function (scope, element, attrs) {
			element.bind("keydown", function (event) {
				if(event.which === 45) {
					scope.$apply(function (){
						scope.$eval(attrs.xcdInsert);
					});
					event.preventDefault();
				}
			});
		};
	})

	.directive('leftKey', function () {
		return function (scope, element, attrs) {
			element.bind("keydown", function (event) {
				if(event.which === 37) {
					scope.$apply(function (){
						scope.$eval(attrs.leftKey);
					});
					event.preventDefault();
				}
			});
		};
	})

	.directive('rightKey', function () {
		return function (scope, element, attrs) {
			element.bind("keydown", function (event) {
				if(event.which === 39){
					scope.$apply(function (){
						scope.$eval(attrs.rightKey);
					});
					event.preventDefault();
				}
			});
		};
	})

	.directive('clickDetect', [
		'$document',
		function($document) {

			return {
				restrict: 'A',
				scope: { clickDetect: '&' },
				link: function(scope, element, attrs) {

					element.on('click', function(e) {
						if(angular.element(e.target).hasClass('box-content') || 
						   angular.element(e.target).hasClass('gridBox') || 
						   angular.element(e.target).hasClass('gridster-content')){
							   
							scope.clickDetect();
						}
						e.stopPropagation(); //stop event from bubbling up to document object
					});

				}
			};
		}
	])

	.directive('resizeWidth', function ($document, $window) {
		return function (scope, element, attrs) {
			element.on('mousedown', function(event) {
				event.preventDefault();
				$document.on('mouseup', mouseup);
			});

			function mouseup(event) {
				
				if (attrs.resizer == 'vertical') {
					
					var x = event.pageX;
					var y = 2;
					if(x > 125.75){
						y = Math.ceil(x / 125.75);
						if(y == 7 || y == 11){ y = y +1}
					}else{
						y = 2;
					}
					scope.$apply(function (){
						scope.pageX = y;
						scope.$eval(attrs.resizeWidth);
					});
				}

				if (attrs.resizer == 'vertical-right') {
					var innerWidth = $window.innerWidth - 30;
					var x = innerWidth- event.pageX;
					var y = 2;
					if(x > 280){
						y = Math.ceil(x / 125.75);
						if(y == 7 || y == 11){ y = y +1}
					}else{
						y = 3;
					}
					scope.$apply(function (){
						scope.pageX = y;
						scope.$eval(attrs.resizeWidth);
					});
				} 

				$document.unbind('mouseup', mouseup);
			}
		};
	})

	.directive('compile', ['$compile', function ($compile) {
	    return function(scope, element, attrs) {
			element.html(scope.$eval(attrs.compile));
			$compile(element.contents())(scope);
	    };
	}])

	.directive('draggable', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element[0].addEventListener('dragstart', scope.handleDragStart, false);
				element[0].addEventListener('dragend', scope.handleDragEnd, false);
			}
		}
	})

	.directive('droppable', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element[0].addEventListener('drop', scope.handleDrop, false);
				element[0].addEventListener('dragover', scope.handleDragOver, false);
			}
		}
	})


	.directive('mdThemeFg', ["$mdTheming", function ($mdTheming) {
	    return {
	        restrict: 'A',
	        link: postLink
	    };
	    function postLink(scope, element, attr) {
	        $mdTheming(element);
	        element.addClass('c-md-fg');
	    }
	}])
	.directive('mdThemeBorder', ["$mdTheming", function ($mdTheming) {
	    return {
	        restrict: 'A',
	        link: postLink
	    };
	    function postLink(scope, element, attr) {
	        $mdTheming(element);
	        element.addClass('c-md-border');
	    }
	}])
	.directive('mdThemeBg', ["$mdTheming", function ($mdTheming) {
	    return {
	        restrict: 'A',
	        link: postLink
	    };
	    function postLink(scope, element, attr) {
	        $mdTheming(element);
	        element.addClass('c-md-bg');
	    }
	}]);

})(window.angular);