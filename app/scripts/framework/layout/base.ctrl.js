define(function () {
	
	var modName = 'grape.base';
	var ctrlName = 'base.ctrl';
	var mod = angular.module(modName, []);
	mod.controller(ctrlName, ["$scope", "$http", "$state", function ($scope, $http, $state) {
		
		var self = this;
		self.currModule = {};
		self.info = {
			moduleNameDisplay: '城慧逛',
			appDescription: '后台管理中心',
			moduleDisplay: '城慧逛',
			menuDisplay:'后台管理中心',
			company:'四川虹慧云商科技有限公司',
			copyright: '2015 - 2016 copy right.'
		}

		self.mainMenus = [
			{
				moduleCode: 'product',
				iconFontClass: 'pe-7s-note',
				nameDisplay: '产品管理',
				subMenus: [
					{
						moduleCode: 'product',
						iconFontClass: 'pe-7s-note',
						nameDisplay: '产品列表',
						stateName: 'product.list.view'
					}
				]
			},
			{
				moduleCode: 'vip',
				iconFontClass: 'pe-7s-users',
				nameDisplay: '会员管理',
				subMenus: [
					{
						moduleCode: 'product',
						iconFontClass: 'pe-7s-note',
						nameDisplay: '会员列表',
						stateName: 'vip.list.view'
					}
				]
			}
		];

		self.navigateModule = function (menu) {
			
			self.currModule = menu;
			self.info.moduleDisplay = menu.nameDisplay;
			self.info.menuDisplay = menu.subMenus ? menu.subMenus[0].nameDisplay: self.info.menuDisplay;
			self.displayModulePane = false; 
		}

		self.toggleModulePane = function () {
			
			self.displayModulePane = !self.displayModulePane;
		}

		self.navigateState = function (menu) {
			
			$state.go(menu.stateName);
		}

		$scope.$on('changedMenu', function (menu) {
			
			self.info.menuDisplay = menu.subMenus ? menu.subMenus[0].nameDisplay: self.info.menuDisplay; 
		})

	}]);

	return modName;
});