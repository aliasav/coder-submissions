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
    			count: null,
    		};
    		
    		$scope.filter = {
    			errors: [],
    			attribute: null,
    			input: null,
    			items: [{
				  	id: 1,
				  	label: 'Language',	
				  	apiName: 'language',			  
				}, 
				{
				  	id: 2,
				  	label: 'Title',	
				  	apiName: 'title',			  
				},
				{
					id: 3,
					label: 'Status',
					apiName: 'status',
				}]

    		};

    		// initialise function
    		// fetches initial submissions
    		(function init(){
    			dashboardService.getSubs()
    			.then(function(result){
    				//console.info(result);
    				if(result[0]===200){
    					prepareSubsData(result[1]); 
    					setLoadingSubsFlag(false);   					
    				}
    				else{
    					setLoadingSubsFlag(false);
    				}
    			});
    		})();

    		$scope.filterSubs = function(){    			
    			clearFilterErrors();
    			if(validateFilter()){    				
    				filter();
    			}
    			else{
    				showFilterValidationErrors();
    			}
    		}

    		function showFilterValidationErrors(){
    			if(!UTILS.validateText($scope.filter.input)){
    				$scope.filter.errors.push("Please enter a valid filter value!");
    			}
    			if(!UTILS.validateText($scope.filter.attribute)){
    				$scope.filter.errors.push("Please enter a valid filter attribute!");
    			}
    		}

    		function clearFilterErrors(){
    			$scope.filter.errors = [];
    		}

    		function validateFilter(){
    			return UTILS.validateText($scope.filter.attribute) && UTILS.validateText($scope.filter.input); 
    		}

    		function filter(){
    			var url = DOMAIN.server + (function(){
    				return "submissions_" + $scope.filter.attribute.apiName + "/" + $scope.filter.input + "/"; 
    			})();
    			console.info("filter url", url);
    			if(url){
    				setLoadingSubsFlag(true);
    				dashboardService.getSubs(url)
    				.then(function(result){
    					setLoadingSubsFlag(false);
    					if(result[0]===200){
    						prepareSubsData(result[1]);
    					}
    				});
    			}
    		}




    		// previous button click handler
    		$scope.previousSubs = function(){
    			//console.info("previous url", $scope.subs.previous);
    			fetchSubs($scope.subs.previous);
    		}

    		// next button click handler
    		$scope.nextSubs = function(){
    			//console.info("next url", $scope.subs.next);
    			fetchSubs($scope.subs.next);
    		}

    		// sets loading flag for subs
    		function setLoadingSubsFlag(flag){
    			if(flag!==null || flag!==undefined){
    				$scope.flags.loadingSubs = flag;
    			}
    		}

    		// fetches subs based on prev/next url
    		function fetchSubs(url){
    			if(url){
    				setLoadingSubsFlag(true);
	    			dashboardService.getSubs(url)
	    			.then(function(result){
	    				setLoadingSubsFlag(false);
	    				if(result[0]===200){    					
	    					prepareSubsData(result[1]);
	    				}	    				
	    			});
    			}    	
    			else{
    				return false;
    			}		
    		}

    		// sets prev/next url and current subs
    		function prepareSubsData(data){
    			console.info("prepareSubsData", data);
    			if(data){
    				$scope.subs.previous = (function(){
    					if (data.hasOwnProperty("previous")){
    						return data.previous;
    					}
    					else{
    						return null;
    					}
    				})();
    				$scope.subs.next = (function(){
    					if (data.hasOwnProperty("next")){
    						return data.next;
    					}
    					else{
    						return null;
    					}
    				})();

    				$scope.subs.count = (function(){
    					if (data.hasOwnProperty("count") && typeof data.count === "number"){
    						return data.count;
    					}
    					else{ 
    						return null; 
    					}
    				})();

    				$scope.currentSubs = data.results;
    			}
    		}
    	
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