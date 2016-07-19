var app = angular.module('appy');
app.controller('ctrl', ctrl);
ctrl.$inject = ['$scope', '$http', 'Facty'];
function ctrl($scope, $http, Facty) {
	$scope.ajaxFn = function(){
		Facty.get().then(function(data){
				console.log('resolved data', data).data;
			}, function(err){
				console.log('err', err);
			});;
	};
};