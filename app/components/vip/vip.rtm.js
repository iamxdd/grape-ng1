define([ "../../scripts/framework/rtm", "./vip.state", "./vip.list.edit.ctrl", "./vip.list.view.ctrl" ], function(rtm, state, vipListEditCtrl, vipListViewCtrl) {
    var modName = "app.vip", mod = angular.module(modName, []);
    rtm(vipListEditCtrl, vipListViewCtrl)(mod);
    state(mod);
    return modName;
});