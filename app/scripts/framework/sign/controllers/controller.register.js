define([
		"./sign.root",
		"./sign.signin",
		"./sign.certified",
		"./sign.recoverpwd",
	], function (
		rootCtrl,
		signinCtrl,
		certifiedCtrl,
		recoverpwdCtrl
	) {

	var modName = 'grape.sign.controllers';
	var mod = angular.module(modName, []);
	var register = function () {
		var args = arguments, length = arguments.length;
		for (var i = 0; i < length; i++) {
			var arg = args[i];
			if (arg && angular.isFunction(arg.__register__)) {
				arg.__register__(mod);
			}
		}
	}

	register(rootCtrl, signinCtrl, certifiedCtrl, recoverpwdCtrl);
	return modName;
})