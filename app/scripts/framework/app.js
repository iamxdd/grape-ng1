"use strict";

define([ "./framework.modules", "../../components/product/product.rtm", "../../components/vip/vip.rtm", "../../components/welcome/welcome.rtm" ], function(frameworkModules, productModule, vipModule, welcomeModule) {
    var modNgModuleNames = frameworkModules;
    modNgModuleNames = [ "ui.bootstrap", "ngTable", "ui.router", "oc.lazyLoad", "siyfion.sfTypeahead", "cgBusy", "datePicker", "ui.tinymce", "ui.select", "ng-sweet-alert", "ngSanitize", productModule, vipModule, welcomeModule ].concat(modNgModuleNames);
    angular.module("app", modNgModuleNames);
    return "app";
});