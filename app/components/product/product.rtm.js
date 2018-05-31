define([ "../../scripts/framework/rtm", "./product.state", "./product.list.edit.ctrl", "./product.list.view.ctrl" ], function(rtm, state, productListEditCtrl, productListViewCtrl) {
    var modName = "app.product", mod = angular.module(modName, []);
    rtm(productListEditCtrl, productListViewCtrl)(mod);
    state(mod);
    return modName;
});