(function(head) {
  head.load([
    '../vendor/jquery/dist/jquery.min.js',
    '../vendor/angular/angular.min.js',
    '../vendor/bootstrap/dist/js/bootstrap.min.js',
    '../vendor/angular-animate/angular-animate.min.js',
    '../vendor/angular-ui-router/release/angular-ui-router.js',
    '../vendor/AngularJS-Toaster/toaster.min.js',
    '../vendor/requirejs/require.js',
    '../vendor/underscore/underscore.js',
  ]).ready(function() {
    requirejs.config({
      baseUrl: './',
      paths: {
        'domReady': '../vendor/domReady/domReady',
        'text': '../vendor/text/text',
        'i18n': '../vendor/i18n/i18n'
      },
      deps: ['./bootstrap-sign']
    });
    requirejs.onError = function(err) {
      console.log(err);
      if(err.requireType === 'timeout') {
        console.log('modules: ' + err.requireModules);
      }
      throw err;
    };
  });
})(window.head);
