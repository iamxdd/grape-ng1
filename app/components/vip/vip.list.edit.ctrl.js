define([ "./vip.di.list.edit" ], function(di) {
    return {
        __register__: function(mod) {
            mod.controller(di.ctrlName, di.diList.concat([ vipListEditCtrl ]));
            return mod;
        }
    };
    /** TODO: Add your logic code. */
    function vipListEditCtrl($scope, $http) {}
});