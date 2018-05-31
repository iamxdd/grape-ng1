define(function () {

	var directiveName = 'selectProvider';
	return {
		__register__: function (mod) {
			mod.directive(directiveName, [
				"$http", 
				"API", 
				"ENV", 
				"SocketService", 
				selectProvider
			]);
			return mod;
		}
	}
	function selectProvider($http, API, ENV, SocketService) {
		
		return {

			restrict: 'EA',
			replace: true,
			transclude: true,
			template: '<div><div ng-transclude></div></div>',
			scope : {
				provide: '&'
			},
			link: function (scope, element, attr){

				var options = {};
				var defaultOpts = {};
				if (scope.provide && angular.isFunction(scope.provide)) {
					options = angular.extend(defaultOpts, scope.provide());
				}else if(scope.provide && angular.isObject(scope.provide)){
					options = angular.extend(defaultOpts, scope.provide);
				}

				if (options.id !== attr.id) return;
				var httpOpts = {
					method: 'GET',
					url: options.url
				}
				if (options.params) {
					httpOpts.params = options.params;
				}
				var uri = options.url.replace(API[ENV].domain, '');
				SocketService.register('dataUpdate', uri, function () {
					fetchData();
				});

				var fetchData = function () {

					var promise = $http(httpOpts).then(
						function success(response) {
							if (options.callback && angular.isFunction(options.callback)) {
								options.callback(response.data);
							}
						},
						function error(err) {
							if (options.error && angular.isFunction(options.error)) {
								options.error(err);
							}
						}
					);
					if (options.busyPromise && angular.isFunction(options.busyPromise)) {
						options.busyPromise(promise)
					}
				}
				fetchData();
			}
		}
	};

});