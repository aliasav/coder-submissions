/* All controllers go in this file */
/* Keep controllers as slim as possible */
/* Separate out as much as possible and include make services out of them. */ 
/* Naming convention for controllers: 'nameController'. A standard convention will make it easier to search for required controllers. */

(function(){

    angular.module('coders.controllers', [
        'coders.services',
        'coders.utils',        
    ])
    
    // home (dashboard) controller
    .controller("homeController", [
    	"$scope",
    	"$http",
    	"API_URLS",
    	"DOMAIN",
    	"dashboardService",
    	"UTILS",    	
    	function(
    		$scope, 
    		$http, 
    		API_URLS, 
    		DOMAIN, 
    		dashboardService, 
    		UTILS
    	){

    		$scope.flags = {
    			loadingSubs: true,
    		};

    		$scope.currentSubs = [];
    		$scope.subs = {
    			next: null,
    			previous: null,
    		};
    		
    		(function init(){
    			dashboardService.getSubs()
    			.then(function(result){
    				console.info(result);
    				if(result[0]===200){
    					var data = result[1];
    					$scope.subs.next = data.next;
    					$scope.subs.previous = data.previous;
    					$scope.currentSubs = data.results;
    				}
    			});
    		})();
    	
    }])

    // home (dashboard) controller
    .controller("statsController", [
    	"$scope",
    	"$http",
    	"API_URLS",
    	"DOMAIN",
    	"dashboardService",
    	"UTILS",    	
    	function(
    		$scope, 
    		$http, 
    		API_URLS, 
    		DOMAIN, 
    		dashboardService, 
    		UTILS
    	){
    		$scope.flags = {
    			loadingStats: true,
    		};

    		$scope.stats = [];    		
    		
    		(function init(){
    			dashboardService.getStats()
    			.then(function(result){
    				console.info(result);
    				if(result[0]===200){
    					$scope.flags.loadingStats = false;
    					var data = result[1];
    					$scope.stats = data;
    				}
    			});
    		})();
  
    }])

;})();