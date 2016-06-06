
/* All services go here */
/* Kindly Keep code modular */
/* Use utlities whenever required */
/* Refactor code after writing modules */

/* 
A word on structuring your Factories/Services:

	For factories/service, declare all objects and methods in a variable of the service/factory name, referencing functions within
	the factory/service. This taken advantage of the function scope in Javascript and allows factory/service methods to be used
	in other factory/service methods. 
*/

(function(){

angular.module('coders.services', [])

// dashboard service
.factory('dashboardService', function($q, $http, DOMAIN, API_URLS){

	var dashboardService = {		
		getSubs: getSubs,	
		getStats: getStats,	
	};

	function getSubs(){
		var defer = $q.defer();
		var url = DOMAIN.server + API_URLS.getSubs;

		$http.get(url)
		.success(function(data, status, headers, config){
			defer.resolve([status, data]);
		})
		.error(function(data, status, headers, config){
			defer.reject([status, data]);
		});

		return defer.promise;		
	}

	function getStats(){
		var defer = $q.defer();
		var url = DOMAIN.server + API_URLS.getStats;

		$http.get(url)
		.success(function(data, status, headers, config){
			defer.resolve([status, data]);
		})
		.error(function(data, status, headers, config){
			defer.reject([status, data]);
		});

		return defer.promise;		
	}

	return dashboardService;
})



})();