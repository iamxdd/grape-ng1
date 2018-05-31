define(function () {
	var controllerName = 'sign.recoverpwd.ctrl';
	return {
		__register__: function (mod) {
			mod.controller(controllerName, ["$http", "$state", "$scope", recoverpwdController]);
			return mod;
		}
	}

	function recoverpwdController($http, $state,$scope) {
		
		var self = this;

		self.typeNewPwd = false;

		self.base = {
			submitButtonText: '找回密码'
		}

		$scope.$emit('navbar.update', {
			text: '返回登录',
			state: 'sign.signin'
		})
	};
})