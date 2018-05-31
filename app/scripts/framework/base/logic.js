define(function () {
	
	var modName = 'grape.base.logic';
	angular.module( modName, []).
	run(["ngTableDefaults", function (ngTableDefaults) {
		ngTableDefaults.params.count = 10;
		ngTableDefaults.settings.counts = [];
	}]).
	factory('GrapeBaseLogic', [
		"$http", 
		"$state", 
		"$window", 
		"$location", 
		"DEFAULT_STATE", 
		"NgTableParams", 
		"ngTableEventsChannel", 
		"SweetAlert", 
		function ($http, $state, $window, $location, DEFAULT_STATE, NgTableParams, ngTableEventsChannel, SweetAlert) {

		var doHttpAction = function (opts) {
			
			var defaultOpts = {
				method: 'GET',
				defaultErrAlert: true,
				success: angular.noop,
				error: angular.noop,
			}
			var options = angular.extend(defaultOpts, opts);
			if (!options.url) return;

			var httpOpts = {
				url: options.url,
				method: options.method
			}

			if (options.data && angular.isFunction(options.data)) {
				httpOpts.data = options.data();
			}else{
				httpOpts.data = options.data;
			}

			if (options.params && angular.isFunction(options.params)) {
				httpOpts.params = params();
			}else if(options.params && angular.isObject(options.params)){
				httpOpts.params = params;
			}
			return $http(httpOpts).then(
				function success(response) {
					if (options.success && angular.isFunction(options.success)) {
						options.success(response.data);
					}
				},
				function error(err) {
					if (options.error && angular.isFunction(options.error)) {
						options.error(err);
					}
					if (options.defaultErrAlert) {
						SweetAlert.error("操作出错啦，请检查网络后重试！", {title: '出错了！'});
					}
				}
			);
		}

		return {

			cfgTable: function (self, scope, opts) {
				
				var defaultTableSettings = {
					count: 20,
					apiUrl: '',
					defaultErrAlert: true
				}

				var options = angular.extend({}, defaultTableSettings, opts);

				var dataCache = [];

				self.tableParams = new NgTableParams({}, {
					getData: function (state) {
						// console.log(state.page());
						var httpOpts = {
							method: 'GET',
							params: {}
						}
						if (options.params) {
							if (typeof(options.params) === 'function') {
								httpOpts.params = options.params();
							}else if(typeof(options.params) === 'object'){
								httpOpts.params = options.params;
							}
						}
						httpOpts.params.page = state.page();
						httpOpts.params.length = options.count;
						scope.listBusyPromise = $http.get(options.apiUrl, httpOpts).then(
							function success(res) {
								state.total(res.data.total);
								dataCache = res.data.content;
								return dataCache;
							},
							function error(err) {
								if (options.defaultErrAlert) {
									SweetAlert.error("获取数据失败！", {title: "错误！"})
								}
							}
						);
						return scope.listBusyPromise;
					}
				});

				scope.$watch(function () {
					return self.allSelectedState;
				}, function (newValue) {
					var needRefresh = false;
					if (newValue) {
						needRefresh = true;
					}else{
						needRefresh = _.every(dataCache, function (item) {return item.isSelected;});
					}

					if (needRefresh) {
						dataCache.map( function ( item, i ) {
							item.isSelected = newValue;
						});
					}
				});

				scope.$watch(function () {
					return dataCache;
				}, function (newValue) {
					self.allSelectedState = _.every(dataCache, function (item) {return item.isSelected;});
				}, true);

				self.reload = function () {
					self.tableParams.reload();
				}

				self.doAction = function (navState, action, rawData){
					switch(action){
						case "edit":{
							if (navState) {
								$state.go(navState, {data: {viewMode: false, raw: rawData, from: $state.current}});
							}
							break;
						}
						case "view":{
							if (navState) {
								$state.go(navState, {data: {viewMode: true, raw: rawData, from: $state.current}});
							}
							break;
						}
						case "delete":{

							break;	
						}
						default:{
							break;
						}
					}
				}
			},

			// 配置搜索历史
			cfgSearchBar: function (self, scope, opts) {

				var defaultOpts = {
					highlight: true
				};

				self.searchTypeaheadOptions = angular.extend({}, defaultOpts, opts);

				var historySearchDataSet = JSON.parse($window.localStorage['searchHistory_' + $location.hash()] || '{"history":[]}');

				var searchBloodHound = new Bloodhound({
					datumTokenizer: function(history) {
						return Bloodhound.tokenizers.whitespace(history.pattern);
					},
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					local: historySearchDataSet.history
				});

				searchBloodHound.initialize();
				self.searchDataSet = {
					displayKey: 'pattern',
					source: searchBloodHound.ttAdapter()
				};

				self.searchObj = {
					searchBloodHound: searchBloodHound
				}
			},

			cfgEditPage: function (self, scope, opts){

				var defaultOpts = {
					defaultErrAlert: true
				}

				var options = angular.extend(defaultOpts, opts);
				var recievedData = $state.params.data;
				if (recievedData) {
					self.viewMode = recievedData.viewMode;
					if (recievedData.raw) {
						self.originEditDataModel = angular.merge({}, recievedData.raw);
						self.editDataModel = recievedData.raw;
					}
				}else{
					$state.go(DEFAULT_STATE);
				}

				self.editSettings = options;
				self.doAction = function (action) {

					var confirmAction = function (doNext) {
						if (doNext) {
							scope.processBusyPromise = doHttpAction(options).then(
								function (data) {
									if (options.isSuccess && angular.isFunction(options.isSuccess)) {
										if (options.isSuccess(data, self.createMode)) {
											SweetAlert.confirm('操作成功，是否继续？', {
												title: '成功！',
												confirmButtonText: '继续',
												cancelButtonText: '返回上个页面',
												closeOnConfirm: false,
												closeOnCancel: true
											}).then(stayOrReturnLastPage);
										}else{
											SweetAlert.error('操作失败！', {title: '出错了！'});
										}
									}
								}
							);
							return scope.processBusyPromise;
						}else{
							swal.close();
							return null;
						}
					}

					var stayOrReturnLastPage = function (stay) {
						
						if (stay) {
							swal.close();
						}else{
							var lastState = options.lastState;
							$state.go(lastState);
						}
					}

					switch(action){
						case "submit": {
							var url = self.createMode ? options.createUrl: options.updateUrl;
							var method = self.createMode ? 'POST': 'PUT';
							var actionName = self.createMode ? '创建': '更新';
							if (url) {
								options.url = url;
								options.method = method;
								SweetAlert.confirm('<strong>确定' + actionName + '吗？<strong>',{
									title:'请确认！',
									html: true,
									confirmButtonText: '是的，' + actionName,
									cancelButtonText: '取消',
									closeOnConfirm: true,
									closeOnCancel: true
								}).then(confirmAction);
							}
							break;
						}
						case "reset":{
							SweetAlert.confirm('<strong>确定重置所有数据吗？<strong>',{
								title:'请确认！',
								html: true,
								confirmButtonText: '是的，重置',
								cancelButtonText: '取消',
								closeOnConfirm: true,
								closeOnCancel: true
							}).then(function (isReset) {
								if (isReset) {
									self.editDataModel = angular.merge(self.editDataModel, self.originEditDataModel);
								}
							});
							break;
						}
						case "cancel":{
							if (self.viewMode) {
								stayOrReturnLastPage(false);
							}else{
								SweetAlert.confirm('<strong>确定退出本页面吗，所有改动不会被保存？<strong>',{
									title:'请确认！',
									html: true,
									confirmButtonText: '是的，退出',
									cancelButtonText: '取消',
									closeOnConfirm: true,
									closeOnCancel: true
								}).then(function (isReset) {
									if (isReset) {
										stayOrReturnLastPage(false);
									}
								});
							}
							break;
						}
						default:{
							break;
						}
					}
				}
			},

			cfgWidgets: function (self, scope, opts) {
				
				var type = opts.type;
				if (!type) return;
				switch(type){
					case "select.provider":{
						self.selectOptions = self.selectOptions || {};
						var defaultOpts = {
							callback: function (data) {
								self.selectOptions[opts.id] = data;
							}
						}

						var options = angular.extend(defaultOpts, opts);

						if (opts.url) {
							self.selectProviderOptions = function () {
								return options;
							}
						}
						break;
					}
					case "image.uploader":{
						var defaultOpts = {
							uploadUrl: '',
							auth: ''
						}
						var opts = angular.extend(defaultOpts, opts);
						self.imageUploadOptions = function () {
							return opts;
						}
						break;
					}
					default:{
						break;
					}

				}
			},

			addItem: function (self, scope, opts) {
				
				if (!opts.url) return;

				var defaultOpts = {
					defaultErrAlert: true,
					method: 'POST',
					url:opts.url,
				}
				var options = angular.extend(defaultOpts, opts);
				scope.processBusyPromise = doHttpAction(options);
				return scope.processBusyPromise;

			},
			updateItem: function (self, scope, opts) {
				
				if (!opts.url) return;

				var defaultOpts = {
					defaultErrAlert: true,
					method: 'PUT',
					url:opts.url,
				}
				var options = angular.extend(defaultOpts, opts);
				scope.processBusyPromise = doHttpAction(options);
				return scope.processBusyPromise;

			},

			deleteItem: function (self, scope, opts) {
				
				if (!opts.url) return;

				var defaultOpts = {
					defaultErrAlert: true,
					method: 'DELETE',
					url:opts.url,
				}
				var options = angular.extend(defaultOpts, opts);
				scope.processBusyPromise = doHttpAction(options);
				return scope.processBusyPromise;
			},

			doHttpAction: function (self, scope, opts) {
				
				scope.processBusyPromise = doHttpAction(opts);
				return scope.processBusyPromise;
			}
		}

	}]);

	return modName;
})