/* web module is defined here */
/* Define all states here using angular-ui router */
/* Do not define any controllers/services/utilities here, all controllers/services/utilities must go in their specific modules */

(function(){
    
    angular

    .module('coders', [
        'coders.controllers',
        'coders.services',
        'coders.utils',
        'coders.filters',
        'ngCookies',
        'ui.router',        
    ])

    // Changing interpolation start/end symbols.
    .config(function($interpolateProvider, $httpProvider){
        
        $interpolateProvider.startSymbol('[[').endSymbol(']]');
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    })

    // CSRF token setting
    .run(function($http, $cookies){
        
        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    })

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
        $urlRouterProvider.otherwise('/dashboard/home');

        $stateProvider
        .state('dashboard', {
            url:'/dashboard',
            templateUrl: '/static/angular_apps/dashboard/views/base.html', 
            abstract: true,           
        })
        .state('dashboard.home',{
            url:'/home',
            controller: 'homeController',
            templateUrl:'/static/angular_apps/dashboard/views/home.html',            
        })
        .state('dashboard.stats', {
            url: '/stats',
            controller: 'statsController',
            templateUrl: '/static/angular_apps/dashboard/views/stats.html',
        })

    }])


    // urls with constant SERVER are used, by default set to development urls
    // changed to production urls while ansible deployment

    // Add development/testing/staging server domains
    // do not modify these patterns
    // if modifying, also make corresponding changes in app_js_settings.sh in ops as well
    .constant("DOMAIN", {
        server: "http://127.0.0.1:8000/", // local
        server1: "http://45.33.80.46/", // production
    })

    // DO NOT hard code these urls anywhere in the project
    .constant("API_URLS", {
        getSubs: "submissions/",
        getStats: "stats/",
    })


;})();
