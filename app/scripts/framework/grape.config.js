define(function() {
  var modName = 'grape.config';

  var DEFAULT_STATE = 'welcome.summary.view';

  toastr.options.timeOut = 3000; //toaster的全局配置
  toastr.options.positionClass = 'toast-bottom-right';

  angular.module(modName, [])
    .constant('DEFAULT_STATE', DEFAULT_STATE)
    .constant('API', {
      'development': {
        domain: 'http://localhost:8080',
        basePath: '/admin',
        socketAddress: 'http://localhost:8081'
      },
      'release': {
        domain: 'http://172.16.77.30',
        basePath: '/admin',
        socketAddress: 'http://bmc.hifgo.com:8081'
      }
    })
    .constant('ENV', 'development')
    .constant('PER_PAGE', 20)
    .value('cgBusyDefaults', {
      message: '处理数据中，请稍后...',
      delay: 100,
      minDuration: 700,
    })
    .value('uiTinymceConfig', {
      language: 'zh_CN',
      menu: {},
      height: 300,
      body_class: 'tinymce-custom-css',
      object_resizing: false,
    });


  angular.module(modName)
    .config(['$logProvider', //logger setting
      function($logProvider) {
        // turn debugging off/on (no info or warn)
        if($logProvider.debugEnabled) {
          $logProvider.debugEnabled(true);
        }
      }
    ])
    .config(['$httpProvider',
      function($httpProvider) {
        // $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
    ])
    .config(['$urlRouterProvider', function($urlRouterProvider) {
      // for any unmatched url, redirect to default state
      $urlRouterProvider.otherwise(DEFAULT_STATE);
    }]);


  angular.module(modName)
    .run(['$rootScope', 'DEFAULT_STATE', '$log', '$state', handleRoutingErrors])
    .run(['$rootScope', updateDocTitle]);


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

  function updateDocTitle($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      event.preventDefault();
      handlingRouteChangeError = false;
      var title = (toState.title || '');
      $rootScope.title = title; // data bind to <title>
    });
  }

  return modName;
});
