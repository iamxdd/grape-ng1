define(function () {
	
	var modName = 'grape.list.widgets';
	var appMod = angular.module(modName,[]);

	appMod.directive('listHeader', ["$q", "$log", "$window", "$location", "SweetAlert", listHeader]);

	function listHeader($q, $log, $window, $location, SweetAlert) {
		
		var templateUrlDynamic = '../../templates/widgets/list.header.html';

		return {

			restrict: 'EA',
			replace: true,
			scope:false,
			link: function (scope, element, attrs) {
				
				var defaultOpts = {
					filter: ['category', 'price'],
		            search: {display: '请输入搜索关键字'},
		            defaultActions: {
		            	createNew: {display: '新建', icon: "fa-plus pretty-red"},
		            	delete: {display: '删除', icon: "fa-trash pretty-red"},
		            },
		            createNew: true,
		            delete: true,
				}

				var options = angular.extend({}, defaultOpts, scope.listheaderSettings);
				scope.context.settings = options;
				templateUrlDynamic = options.templateUrl || templateUrlDynamic;

				// 操作初始化
				scope.actions = new Array();
				if (options.createNew) {
					options.customActions.createNew = options.defaultActions.createNew;
				}
				if (options.delete) {
					options.customActions.delete = options.defaultActions.delete;
				}

				if (options.customActions) {
					scope.actions = Object.keys(options.customActions).map( function (key, idx) {
						var obj = options.customActions[key];
						obj.name = key;
						return obj;
					});
					scope.currentAction = scope.actions[0];
				}

				// 过滤器值由外部直接传入
				if (options.filters) {
					var fn = options.filters, result;
					if (typeof(fn) === 'function') {
						result = fn();
					}
					if (typeof(fn) === 'array') {
						result = fn;
					}
					scope.filters = result.map(function (filter) {
						
						if (!filter.type || filter.type === 'common') {
							return filter;
						}
					}).filter(function (filter) {
						return filter !== undefined;
					});

					scope.datetimeSelectors = result.map(function (filter) {
						
						if (filter.type === 'datetime') {
							return filter;
						}
					}).filter(function (filter) {
						return filter !== undefined;
					});

					//初始化选择第一个作为默认值
					angular.forEach(scope.filters, function (filter) {
						filter.value = filter.data[0].Id;
					});
				}

				// 批量操作调用函数
				scope.actionImplement = function (action) {

					SweetAlert.confirm('<strong>是否进行' + action.display + '操作？</strong>', {
						title: '请确认',
						html: true,
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						closeOnConfirm: false,
						closeOnCancel: true
					}).then(
						function (doNext) {
							if (doNext) {
								scope.currentAction = action;
								doAction();
							}
						}
					)

					var doAction = function () {
						
						if (scope.currentAction.name === 'createNew') {

						}
						else if (scope.currentAction.name === 'delete') {
							
						}
						else{
							//自定义操作回调
							var fn = scope.listheaderSettings[scope.currentAction.name];
							if (fn && typeof(fn) === 'function') {
								fn(scope.context.tableParams.data, function (success, msg) {
									msg = msg || (success?"操作成功！":"操作失败！");
									if (success) {
										SweetAlert.success(msg, {title: "成功！"});
									}else{
										SweetAlert.error(msg, {title: "失败！"});
									}
								});
							}else{
								swal.close();
							}
						}
					}
				}

				scope.context.doSearchAction = function () {
					
					var historyKey = 'searchHistory_' + $location.hash();
					var searchBloodHound = scope.context.searchObj.searchBloodHound;
					var historySearchDataSet = JSON.parse($window.localStorage[historyKey] || '{"history":[]}');
					
					var patternExists = false;
					angular.forEach(historySearchDataSet.history, function(history) {
						if(history.pattern === scope.context.userSearchPattern) {
							patternExists = true;
							return;
						}
					});

					if(!patternExists) {
						historySearchDataSet.history.push({
							pattern: scope.context.userSearchPattern
						});
						$window.localStorage[historyKey] = JSON.stringify(historySearchDataSet);
						//本次搜索放入下拉中
						searchBloodHound.add({
							pattern: scope.context.userSearchPattern
						});
					}

					scope.context.reload();
				}
			},
			templateUrl: templateUrlDynamic,
		}
	}
	return modName;	
})