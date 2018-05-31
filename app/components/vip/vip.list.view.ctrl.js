define([ "./vip.di.list.view" ], function(di) {
    return {
        __register__: function(mod) {
            mod.controller(di.ctrlName, di.diList.concat([ vipListViewCtrl ]));
            return mod;
        }
    };
    /** TODO: Add your logic code. */
    function vipListViewCtrl($scope, $http) {}
});