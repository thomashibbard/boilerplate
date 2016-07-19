var app = angular.module('appy');
app.directive('ajaxy', ajaxy);
function ajaxy(){
	return {
		restrict: 'E',
		template: '<button ng-click="ajaxFn()">click</button>'
	};
}