define(function () {

	var controllerName = "sign.signin.ctrl";
	return {
		__register__: function (mod) {
			mod.controller(controllerName, ["$http", "$state", "$scope", "sessionService", signinController]);
			return mod;
		}
	}

	function signinController($http, $state, $scope, sessionService) {
		
		var self = this;
		self.signning = {
			loginButtonText: "登录"
		}

		self.nav2RecoverPwd = function () {
			$state.go('sign.recoverpwd');
		}

		$scope.$emit('navbar.update', {
			text: '商管权限认领',
			state: 'sign.certified'
		});

		sessionService.session.clear();
	};
})