define([ "./welcome.di.summary.view" ], function(di) {
    return {
        __register__: function(mod) {
            mod.controller(di.ctrlName, di.diList.concat([ welcomeSummaryViewCtrl ]));
            return mod;
        }
    };
    /** TODO: Add your logic code. */
    function welcomeSummaryViewCtrl($scope, $http) {}
});