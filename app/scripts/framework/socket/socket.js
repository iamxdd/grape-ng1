define(function () {
	var modName = 'grape.socket';
	var mod = angular.module(modName,[]);
	mod.service('SocketService', ['API','ENV','$log',function (API, ENV, $log) {


		var SocketServiceWrapper = function (address, opts) {
			
			var self = this;
			var defaultOptions = {

			};

			var options = angular.extend(defaultOptions, opts);
			self.socketClient = io(address, options);
			self.regEvents = new Object();
			self.registerListenEvent = function (evnt, callback) {
				var regRequest = self.regEvents[evnt];
				regRequest = regRequest || {};
				regRequest.callback = callback;
				self.regEvents[evnt] = regRequest;
			};
			self.getEventRequest = function (evnt) {
				if (evnt) {
					return self.regEvents[evnt];
				}else{
					return null;
				}
			};
			self.socketClient.on('changed', function (data) {
				if (!data) return;
				var event = data.event;
				if (event) {
					var regRequest = self.getEventRequest(event);
					if (!regRequest) return;
					if (regRequest.callback && angular.isFunction(regRequest.callback)) {
						regRequest.callback(data);
					}
				}
			});

			self.socketClient.on('connect', function () {
				$log.info('Socket connected.');
			});

			self.socketClient.on('disconnect', function () {
				$log.info('Socket disconnected.');
			});

		}
		
		var self = this;
		var socketAddress = API[ENV].socketAddress;
		if (!socketAddress) return null;
		self.sockets = {};
		self.register = function (module, event, callback) {

			if (module && angular.isString(module)) {
				var mod = self.sockets[module];
				mod.registerListenEvent(event, callback);
			}
		};
		var socketsUri = {
			//数据更改
			dataUpdate: '/data-update',
			//站内消息
			insiteMsg: '/insite-message',
			//公告消息
			bulletinMsg:'/bulletin-message',
			//登录消息
			loggedMsg: '/logged-message'
		};

		angular.forEach(socketsUri, function (value, key) {
			var socket = new SocketServiceWrapper(socketAddress, {});
			self.sockets[key] = socket;
		});
		
		return {register: self.register};

	}]);

	return modName;
});