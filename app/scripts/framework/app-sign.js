"use strict";

define([
        "./shared/services",
		"./sign/router/sign.state",
		"./sign/controllers/controller.register"
	], function(
        sharedServices,
		signStateModule,
		controllersRegisterModule
	) {

	var modName = "app-sign";
    angular.module(modName, [
    	"ui.router",
    	"toaster",
    	"ngAnimate",
        sharedServices,
    	controllersRegisterModule,
    	signStateModule
    ]);
    return modName;
});