define( [
		"./grape.config",
		"./layout/base.ctrl",
		"./base/logic",
		"./base/list.widgets",
		"../widgets/module",
		"./socket/socket"
	],function (
		grapeModule,
		grapeBaseCtrl,
		grapeBaseLogic,
		grapeListWidgets,
		grapeWidgetsModule,
		grapeSocket
	) {

	return [
		'ui.bootstrap.contextMenu',
		'ngDialog',
		'nsPopover',
		grapeModule,
		grapeBaseCtrl,
		grapeBaseLogic,
		grapeListWidgets,
		grapeWidgetsModule,
		grapeSocket
	];
})