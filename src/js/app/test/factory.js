var app = angular.module('appy');
app.factory('Facty', Facty);
function Facty($http){
	return {
		get: function(){
			return $http({
				type: 'get',
				url: './test/'
			});
		}
	};
}