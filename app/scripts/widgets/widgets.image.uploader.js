define(function () {
	
	var directiveName = 'imageUploader';
	return {
		__register__: function (mod) {
			mod.directive(directiveName, ["$http", imageUploader]);
			return mod;
		}
	}

	function imageUploader($http) {
		
		var templateHtmlString = '<div cg-busy="uploadBusyPromise" class="controls clearfix gp-uploader">'
		+ '<ul><li><input type="file"  role="uploader" value="" ng-show="false" />'
		+ '<img src="images/upload.png" title="点击上传图片" role="trigger"/></li>'
		+ '<li><img role="loaded" ng-src="{{defaultImg}}"></li><li class="tip-inline">图片大小不能大于2M</li>'
		+ '</ul></div></div>';
		
		return {
			
			restrict: 'EA',
			template: templateHtmlString,
			replace: true,
			scope : {
				defaultImg: '@',
				readonly: '@',
				options: '&',
				callback: '&uifCallback',
			},
			link: function (scope, element, attr){
				
				var $ele = $(element);
				var uploader = $ele.find('input[role=uploader]')	;
				var trigger = $ele.find('img[role=trigger]');
				var loaded = $ele.find('img[role=loaded]');
				var uploadUrl = '';
				var headers = {
					// "Authorization": "Bearer " + localStorage.getItem("bmc_token"),
					'Content-Type': undefined,
					"Accept": "application/json"
				}
				var opts = {};
				var defaultOptions = {};
				if (scope.options && angular.isFunction(scope.options)) {
					opts = angular.extend(defaultOptions,scope.options());
				}else if(scope.options && angular.isObject(scope.options)){
					opts = angular.extend(defaultOptions, scope.options);
				}

				if (attr.id !== opts.id) return;
				
				if (opts.auth) {
					headers.Authorization = opts.auth;
				}

				if (opts.uploadUrl) {
					uploadUrl = opts.uploadUrl;
				}

				if (opts.defaultImg) {
					scope.defaultImg = opts.defaultImg;
				}

				if (opts.callback) {
					scope.callback = opts.callback;
				}

				if (opts.readonly && angular.isFunction(opts.readonly)) {
					scope.readonly = opts.readonly()
				}else{
					scope.readonly = scope.readonly || false;
				}


				trigger.click( function (){
					if (!!scope.readonly) {
						uploader.click();
					}
				});

				scope.$on('reset-uploader', function (){
					loaded.attr('src', "");
				});
				
				uploader.on('change', function (){
					var fd = new FormData();
					var $this = $(this);
					var file = $this.get(0).files[0];
					fd.append('image', file);
					scope.uploadBusyPromise = $http({
						method: 'POST',
						url: uploadUrl,
						data: fd,
						headers: headers,
						transformRequest: angular.identity
					}).then( 
						function (response){
							
							if (scope.callback){
								scope.callback({params: {uploader: element, response: response}});
							}
						},
						function (err){
							if (scope.callback){
								scope.callback({params: {uploader:'', response: null}});
							}
						}
					);
					uploader.val("");
				});
			}
		}	
	};

});