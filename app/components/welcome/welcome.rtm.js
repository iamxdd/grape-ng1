define([ "../../scripts/framework/rtm", "./welcome.state", "./welcome.summary.view.ctrl" ], function(rtm, state, welcomeSummaryViewCtrl) {
    var modName = "app.welcome", mod = angular.module(modName, []);
    rtm(welcomeSummaryViewCtrl)(mod);
    state(mod);
    return modName;
});