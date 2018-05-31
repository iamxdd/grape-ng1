define(
	[
		"./widgets.image.uploader",
		"./widgets.select.provider",
		"./widgets.time-line",
		"../framework/rtm"
	], 
	function (imageUploader, selectProvider, timeLine, rtm) {

	var modName = 'grape.widgets';
	var appMod = angular.module(modName,[]);
	rtm(imageUploader, selectProvider,timeLine)(appMod);
	return modName;
})