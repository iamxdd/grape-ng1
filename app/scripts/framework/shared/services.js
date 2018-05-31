define(['../../common/utils/session'], function (session) {
	
	var modName = 'grape.shared.service';
	var sessionServiceName = 'sessionService';
	angular.module(modName, [])
	.service(sessionServiceName, function () {
		this.session = session();
	});

	return modName;
});