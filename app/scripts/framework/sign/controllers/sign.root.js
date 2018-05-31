define(function () {

	var controllerName = "sign.root.ctrl";
	return {
		__register__: function (mod) {
			mod.controller(controllerName, ["$http", "$state", "$scope", signinController]);
			return mod;
		}
	}

	function signinController($http, $state, $scope) {
		
		var self = this;
		self.info = {
			moduleNameDisplay: "城慧逛",
			appDescription: "登录"
		}


		self.nav2State = function () {
			if (self.navdata && self.navdata.state) {
				$state.go(self.navdata.state);
			}
		}

		$scope.$on('navbar.update', function (e, data) {
			self.navdata = data;
		})
	};
})