define(function () {
	var controllerName = 'sign.certified.ctrl';
	return {
		__register__: function (mod) {
			mod.controller(controllerName, ["$http", "$state", "$scope", certifiedController]);
			return mod;
		}
	}

	function certifiedController($http, $state, $scope) {
		
		var self = this;
		self.base = {
			certifiedButtonText: "认领"
		}

		$scope.$emit('navbar.update', {
			text: '返回登录',
			state: 'sign.signin'
		});
	};
})