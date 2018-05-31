define(function () {
	
	var modName = "grape.sign.router";

	var DEFAULT_STATE = "sign.signin";
	var DEFAULT_URL = "/sign/signin";

	var mod = angular.module(modName, [])
	.config(["$stateProvider", stateConfig]);

	function stateConfig($stateProvider) {
		
		$stateProvider
		.state("sign",{
			url: '/sign',
			abstract: true,
			template: "<ui-view/>"
		})
		.state("sign.signin", {
			url: '/signin',
			templateUrl: '../../templates/sign/signin.html',
			controller: 'sign.signin.ctrl',
			controllerAs: 'context',
			params: {
				data: null
			}
		})
		.state("sign.certified",{
			url: '/certified',
			templateUrl: '../../templates/sign/certified.html',
			controller: 'sign.certified.ctrl',
			controllerAs: 'context',
			params: {
				data: null
			}
		})
		.state("sign.recoverpwd", {
			url: '/recoverpwd',
			templateUrl: '../../templates/sign/recoverpwd.html',
			controller: 'sign.recoverpwd.ctrl',
			controllerAs: 'context',
			params: {
				data: null
			}
		});
	};

	mod
    .constant('DEFAULT_URL', DEFAULT_URL)
    .constant('DEFAULT_STATE', DEFAULT_STATE)
    .constant('API', {
      'development': {
        domain: 'http://localhost:8090',
        basePath: '/admin',
        socketAddress: 'http://localhost:8091',
        signinSuccessTarget: 'http://localhost:9000'
      },
      'release': {
        domain: 'http://172.16.77.30',
        basePath: '/admin',
        socketAddress: 'http://bmc.hifgo.com:8081',
        signinSuccessTarget: 'http://localhost:9000'
      }
    })
    .constant('ENV', 'development')
    .constant('PER_PAGE', 20);
    

	mod.config(["$urlRouterProvider", function ($urlRouterProvider) {
		$urlRouterProvider.otherwise(DEFAULT_URL);
	}]);

	mod
    .run(['$rootScope', 'DEFAULT_STATE', '$log', '$state', handleRoutingErrors]);
    // .run(['$rootScope', updateDocTitle]);


  	var handlingRouteChangeError = false;

  	function handleRoutingErrors($rootScope, DEFAULT_STATE, $log, $state) {
	    // Route cancellation:
	    // On routing error, go to the dashboard.
	    // Provide an exit clause if it tries to do it twice.
	    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
	      if(handlingRouteChangeError) {
	        return;
	      }
	      handlingRouteChangeError = true;
	      var destination = toState.to || 'unknown target';
	      var msg = 'Error routing to ' + destination + '. ' + (error || '');
	      $log.debug(msg);
	      $state.go(DEFAULT_STATE);
	    });
	}

  	// function updateDocTitle($rootScope) {
   //  	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
	  //     event.preventDefault();
	  //     handlingRouteChangeError = false;
	  //   });
  	// }

	return modName;
});