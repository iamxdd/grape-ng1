(function(head) {
  head.load([
    '../vendor/jquery/dist/jquery.min.js',
    '../vendor/angular/angular.min.js',
    '../vendor/bootstrap/dist/js/bootstrap.min.js',
    '../vendor/angular-sanitize/angular-sanitize.min.js',
    '../vendor/angular-ui-router/release/angular-ui-router.js',
    '../vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
    '../vendor/angular-ui-select/dist/select.min.js',
    '../vendor/angular-bootstrap-contextmenu/contextMenu.js',
    '../vendor/typeahead.js/dist/typeahead.bundle.min.js',
    '../vendor/angular-typeahead/dist/angular-typeahead.min.js',
    '../vendor/angular-busy-plus/dist/angular-busy.min.js',
    '../vendor/angular-datepicker/dist/angular-datepicker.js',
    '../vendor/ng-dialog/js/ngDialog.min.js',
    '../vendor/nsPopover/src/nsPopover.js',
    '../vendor/tinymce/tinymce.min.js',
    '../vendor/moment/min/moment-with-locales.min.js',
    '../vendor/moment-timezone/builds/moment-timezone-with-data.min.js',
    '../vendor/angular-ui-tinymce/dist/tinymce.min.js',
    '../vendor/sweetalert/dist/sweetalert.min.js',
    '../vendor/ng-sweet-alert/ng-sweet-alert.js',
    '../vendor/ng-table/dist/ng-table.min.js',
    '../vendor/toastr/toastr.min.js',
    '../vendor/socket.io-client/dist/socket.io.js',
    '../vendor/requirejs/require.js',
    '../vendor/underscore/underscore.js',
    '../vendor/oclazyload/dist/ocLazyLoad.require.js',
  ]).ready(function() {
    moment.locale('zh-cn');
    requirejs.config({
      baseUrl: './',
      paths: {
        'domReady': '../vendor/domReady/domReady',
        'text': '../vendor/text/text',
        'i18n': '../vendor/i18n/i18n',
      },
      deps: ['./bootstrap']
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
