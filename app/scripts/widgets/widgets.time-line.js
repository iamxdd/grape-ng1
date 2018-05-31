define(function () {

	var directiveName = 'timeLine';
	return {
		__register__: function (mod) {
			mod.directive(directiveName, [
				"$http",
				"$compile", 
				"API", 
				"ENV", 
				"SocketService",
				"ngDialog",
				selectProvider
			]).config(['$qProvider', function ($qProvider) {
				$qProvider.errorOnUnhandledRejections(false);
			}]).run(["$templateCache", templatesPreputinCache]);
			return mod;
		}
	}

	function templatesPreputinCache($templateCache) {
		
		var templateDialogHtmlString = '<div class="tl-section-editor">'
		+ '<div class="input-group">'
		+ '<label class="input-group-addon">开始时间</label>'
		+ '<input date-time auto-close="true" format="LLL" class="form-control" type="text" ng-model="newSection.timeRange.start" disabled="disabled" tabindex="1">'
		+ '</div>'
		+ '<div class="input-group">'
		+ '<label class="input-group-addon">结束时间</label>'
		+ '<input id="endTimeInput" date-time auto-close="true" readonly="readonly" format="LLL" class="form-control" type="text" max-date="newSection.timeRange.end" ng-model="newSection.timeRange.end" tabindex="3">'
		+ '</div>'
		+ '<div class="tl-section-editor-submit">'
		+ '<button type="button" class="btn btn-primary" ng-click="closeThisDialog(newSection)" tabindex="2">确定</button>'
		+ '</div>'
		+ '</div>'
		$templateCache.put('defaultTimelineSectionEditor', templateDialogHtmlString);

		var templatePopoverHtmlString = '<div class="triangle"></div>'
		+ '<div class="ns-popover-tooltip tl-section-popover">'
		+ '<ul>'
		+ '<li ng-repeat="property in displayProperties">'
		+ '<div class="input-group">'
		+ '<label class="input-group-addon">{{property.display}}</label>'
		+ '<input class="form-control" type="text" value="{{property.value}}" disabled="disabled" title="{{property.value}}">'
		+ '</div>'
		+ '</li>'
		+ '</ul>'
		+ '</div>'

		$templateCache.put('defaultTimelineSectionPopover', templatePopoverHtmlString);
	}

	function constructContextMenu(scope, element, attr, $compile){

		var contextMenuHtmlString = '<div context-menu="tlContextMenusOptions" context-menu-class="tl-dropdown-menu-in"></div>';
		var contextMenu = $compile(contextMenuHtmlString)(scope);
		element.append(contextMenu);

		return contextMenu;
	}

	function selectProvider($http, $compile, API, ENV, SocketService, ngDialog) {

		var templateHtmlString = '<div class="tl-container">'
		+ '<span ns-popover ns-popover-template="defaultTimelineSectionPopover" ns-popover-trigger="click" ns-popover-placement="top|center" ns-popover-theme="ns-popover-tooltip-theme" ns-popover-timeout="-1" class="tl-section" ng-repeat="tl_section in tl_sections" style="{{tl_section.sectionShape.getStyleString()}}" tl-index="{{$index}}" ng-Mouseenter="sectionEnter($index)", ng-Mouseleave="sectionLeave($index)">'
		+ '<i class="tl-node" style="{{tl_section.sectionShape.startNode.getStyleString()}}" ng-hide="tl_section.sectionShape.startNode.shouldHide"></i>'
		+ '<i class="tl-node" style="{{tl_section.sectionShape.endNode.getStyleString()}}" ng-hide="tl_section.endNode.shouldHide"></i>'
		+ '</span>'
		+ '</div>';
		
		return {

			restrict: 'A',
			template: templateHtmlString,
			replace: true,
			scope: {
				options: '&tlOptions'
			},
			link: function (scope, element, attr){

				if (!scope.options) throw new Error('Time line component need an assigned option!');
				var contextMenu = constructContextMenu(scope, element, attr, $compile);
				var defaultOpts = {
					minDatetime: new Date(),
					maxDatetime: new Date(new Date().valueOf() + 1000 * 3600 * 24 * 30),
					height: 20,
					baseWidth: 1024,
					editTimelineSectionCallback: undefined,

				}

				var opt = {};
				if (angular.isFunction(scope.options)) {
					opt = angular.merge(defaultOpts, scope.options());
				}else if(angular.isObject(scope.options)){
					opt = angular.merge(defaultOpts, scope.options);
				}else{
					throw new Error('Specified option is illegal, should be a function or object.');
				}

				scope.tl_sections = [];

				// 初始化时间轴
				var margin = 20;
				var containerDOM = element.get(0);
				element.css({
					width: opt.baseWidth,
					height: opt.height
				});

				scope.getStylesString = function (target) {
					var styleArray = [];	
					angular.forEach(target.styles, function (value, styleName) {
						styleArray.push(styleName + ':' + value);
					}, styleArray);
					return styleArray.join(';');
				}

				function _Node(point) {
					
					var self = this;
					this.size = opt.height;
					this.left = point - (this.size / 2);
					this.top = 0 - (this.size / 4);
					this.setPoint = function (newPoint) {
						this.left = newPoint;
					}
					this.getStyleString = function () {
						var styleObj = {
							left: self.left + 'px',
							top: self.top + 'px',
							height: self.size + 'px',
							width: self.size + 'px',
							'border-radius': self.size + 'px'
						}
						var styleArray = [];	
						angular.forEach(styleObj, function (value, styleName) {
							styleArray.push(styleName + ':' + value);
						}, styleArray);
						return styleArray.join(';');
					}
				}

				function _SectionShape(width){

					var self = this;
					this.height = opt.height / 2;
					this.width = width;
					this.setWidth = function (newWidth) {
						self.width = newWidth;
						return self;
					}
					this.startPoint = 0;
					this.endPoint = this.width;
					this.getStyleString = function () {
						var styleObj = {
							width: self.width + 'px',
							height: self.height + 'px'
						}
						var styleArray = [];	
						angular.forEach(styleObj, function (value, styleName) {
							styleArray.push(styleName + ':' + value);
						}, styleArray);
						return styleArray.join(';');
					}

					this.startNode = new _Node(this.startPoint);
					this.endNode = new _Node(this.endPoint);
				}

				function _Section(width, data) {
					
					this.sectionShape = new _SectionShape(width);
					this.timeRange = data.timeRange;
					this.externalData = data.externalData;
				}


				function calculateTimelineSectionWidth(timeRange) {
					
					var baseStartTime = opt.minDatetime.valueOf();
					var baseEndTime = opt.maxDatetime.valueOf();
					var baseTimeRange = baseEndTime - baseStartTime;

					if (timeRange > baseTimeRange) {
						throw new Error("The time range is invalid.");
					}

					var ratio = timeRange / baseTimeRange;
					var timelineSectionWidth = parseInt(timelineWidth * ratio);

					return timelineSectionWidth;
				}

				// 支持删除或者调整节点
				function bobbleSections(selectSection, index, data) {
					
					var nextSection = scope.tl_sections[index + 1];
					var startTime = selectSection.timeRange.start;
					var endTime = nextSection.timeRange.end;
					// 无data是删除
					var sectionData = data ? data.value : nextSection;
					if (!sectionData || !sectionData.timeRange) return [];
					var newTimeStamp = endTime;
					if (sectionData.timeRange.end.toDate) {
						newTimeStamp = sectionData.timeRange.end.toDate();
					}else{
					 	newTimeStamp = sectionData.timeRange.end;
					}

					if (newTimeStamp.valueOf() === nextSection.timeRange.end.valueOf()) {
						// 删除节点
						var range = newTimeStamp - startTime;
						var width = calculateTimelineSectionWidth(range);
						var section = new _Section(width, {
							timeRange: {
								start: startTime,
								end: newTimeStamp
							},
							externalData: nextSection.externalData
						});
						return section;
					}else{
						// 修改节点
						var firstTimeRange = newTimeStamp - startTime;
						var lastTimeRange = endTime - newTimeStamp;

						var firstWidth = calculateTimelineSectionWidth(firstTimeRange);
						var lastWidth = calculateTimelineSectionWidth(lastTimeRange);

						var firstSection = new _Section(firstWidth, {
							timeRange: {
								start: selectSection.timeRange.start,
								end: newTimeStamp
							},
							externalData: sectionData.externalData
						});
						var lastSection = new _Section(lastWidth, {
							timeRange: {
								start: newTimeStamp,
								end: nextSection.timeRange.end
							},
							externalData: nextSection.externalData
						});

						return [firstSection, lastSection];
					}
				}

				// 支持增加节点
				function splitSelectSection(selectSection, data) {

					var startTime = selectSection.timeRange.start;
					var endTime = selectSection.timeRange.end;
					var sectionData = data.value;
					if (!sectionData || !sectionData.timeRange) return [];
					var newTimeStamp = endTime;
					if (sectionData.timeRange.end.toDate) {
						newTimeStamp = sectionData.timeRange.end.toDate();
					}else{
					 	newTimeStamp = sectionData.timeRange.end;
					}

					var firstTimeRange = newTimeStamp - startTime;
					var lastTimeRange = endTime - newTimeStamp;

					var firstWidth = calculateTimelineSectionWidth(firstTimeRange);
					var lastWidth = calculateTimelineSectionWidth(lastTimeRange);

					var firstSection = new _Section(firstWidth, {
						timeRange: {
							start: selectSection.timeRange.start,
							end: newTimeStamp
						},
						externalData: sectionData.externalData
					});
					var lastSection = new _Section(lastWidth, {
						timeRange: {
							start: newTimeStamp,
							end: selectSection.timeRange.end
						},
						externalData: sectionData.externalData
					});

					return [firstSection, lastSection];
				}

				function promptDefaultSectionPropertiesEditor(selectSection) {
					scope.currentSelectSection = selectSection;
					scope.newSection = {
						timeRange:{
							start: selectSection.timeRange.start,
							end: selectSection.timeRange.end
						}
					};
					return ngDialog.open({
						template: 'defaultTimelineSectionEditor',
						scope: scope,
						closeByDocument: false
					}).closePromise;
				}

				function promptDefaultSectionPropertiesEditorUpdate(selectSection, index) {
					// 编辑，当前选择的时间段为当前编辑的和后面一段，否则，无法往后编辑
					var nextSection = scope.tl_sections[index + 1];
					scope.currentSelectSection = {
						timeRange:{
							start: selectSection.timeRange.start,
							end: nextSection.timeRange.end
						},
						externalData: selectSection.externalData
					}
					scope.newSection = {
						timeRange:{
							start: selectSection.timeRange.start,
							end: selectSection.timeRange.end
						}
					};
					return ngDialog.open({
						template: 'defaultTimelineSectionEditor',
						scope: scope,
						closeByDocument: false
					}).closePromise;
				}

				function hideSectionNode() {
					
					angular.forEach(scope.tl_sections, function (section, index) {
						if (index == 0) {
							section.sectionShape.endNode.shouldHide = true;
						}else{
							section.sectionShape.startNode.shouldHide = true;
						}
					});
				}

				function createDisplayPopover(index) {
					
					if (index < 0 || index > scope.tl_sections.length) 
						throw new Error("index is invalid.");
					var section = scope.tl_sections[index];
					scope.displayProperties = [];
						
					scope.displayProperties.push({
						display: '开始时间',
						value: moment(section.timeRange.start).format('LLL'),
					});
					scope.displayProperties.push({
						display: '结束时间',
						value: moment(section.timeRange.end).format('LLL'),
					});
					angular.forEach(section.externalData, function (val, key) {
						scope.displayProperties.push({
							display: key,
							value: val
						});
					})
				}

				function modifyTimelineSections(type, selectSection, index) {

					var insertSections = function (sections) {
						var newSections = [];
						angular.forEach(scope.tl_sections, function (section, idx) {
							if (idx === index) {
								newSections = newSections.concat(sections);
							}else{
								newSections.push(section);
							}
						});
						
						scope.tl_sections = newSections;
						hideSectionNode();
					}

					var editSection = function (sections) {
						
						var newSections = [];
						angular.forEach(scope.tl_sections, function (section, idx) {
							if (idx == index) {
								newSections.push(sections[0]);
							}else if(idx == index + 1){
								newSections.push(sections[1]);
							}else{
								newSections.push(section);
							}
						});
						scope.tl_sections = newSections;
						hideSectionNode();
					}

					var deleteSection = function (newSection) {
						var newSections = [];
						angular.forEach(scope.tl_sections, function (section, idx) {
							if (idx === index) {
								newSections.push(newSection);
							}else if(idx === index + 1){
								// 不做操作
							}else{
								newSections.push(section);
							}
						});
						scope.tl_sections = newSections;
						hideSectionNode();
					}

					// 删除
					if (type === 'D') {

						if (opt.deletePromise) {
							opt.deletePromise.then(function () {
								deleteSection(bobbleSections(selectSection, index));
							});
						}else{
							deleteSection(bobbleSections(selectSection, index));
						}
						return;
					}
					
					if (opt.editTimelineSectionCallback && angular.isFunction(opt.editTimelineSectionCallback)) {
			        	
			        	var editPromise = opt.editTimelineSectionCallback(selectSection.timeRange);
			        	editPromise.then(function (data) {

			        		if (data && angular.isObject(data.value)) {
			        			if (type === 'C') {
					        		insertSections(splitSelectSection(selectSection, data));
			        			}else if(type === 'U'){
			        				editSection(bobbleSections(selectSection, index, data));
			        			}
				        	}
			        	});

			        }else{

			        	if (type === 'U') {
			        		promptDefaultSectionPropertiesEditorUpdate(selectSection, index).then(function (data) {
		        				if (data.value && angular.isObject(data.value)) {
			        				editSection(bobbleSections(selectSection, index, data));
		        				}
				        	});
			        	}

			        	if (type === 'C') {
			        		promptDefaultSectionPropertiesEditor(selectSection).then(function (data) {
			        			if (data.value && angular.isObject(data.value)) {
					        		insertSections(splitSelectSection(selectSection, data));
			        			}
				        	});
			        	}
			        }
				}

				function getSectionSpecifyDom(target) {
					var sectionIdx = parseInt(angular.element(target).attr('tl-index'));
					return {
						index: sectionIdx,
						section: scope.tl_sections[sectionIdx]
					};
				}

				scope.highlightedSection = false;
				var timelineWidth = opt.baseWidth - margin * 2;
				var baseSection = new _Section(timelineWidth, {
					timeRange: {
						start: opt.minDatetime,
						end: opt.maxDatetime
					}
				});
				scope.tl_sections.push(baseSection);
				createDisplayPopover(0);

				// 右键菜单及事件
				var deleteItemHtmlString = '<a class="tl-context-menu-delete"><i class="fa fa-trash"></i>删除时间段</a>'

				var deleteItem = {
					html: deleteItemHtmlString,
					click: function ($itemScope, $event, value) {
						// 只能删除后面有时间段的时间轴
				        var sectionIdx = parseInt(angular.element($event.target).attr('tl-index'));
				        if (sectionIdx < scope.tl_sections.length - 1) {
			        		var section = scope.tl_sections[sectionIdx];
				        	modifyTimelineSections('D', section, sectionIdx);
				        }
					}
				}

				scope.tlContextMenusOptions = [
				    ['新增时间节点', function ($itemScope, $event, modelValue, text, $li) {
				        
			        	var section = getSectionSpecifyDom($event.target);
			        	modifyTimelineSections('C', section.section, section.index);
				    }],
				    null, // Dividier
				    ['编辑时间段内容', function ($itemScope, $event, modelValue, text, $li) {
				        
				        // 只能修改后面有时间段的时间轴
						var sectionIdx = parseInt(angular.element($event.target).attr('tl-index'));
				        if (sectionIdx < scope.tl_sections.length - 1) {
			        		var section = scope.tl_sections[sectionIdx];
				        	modifyTimelineSections('U', section, sectionIdx);
				        }
				    }],
				    ['查看时间段内容', function ($itemScope, $event, modelValue, text, $li) {
				        
		        		var section = getSectionSpecifyDom($event.target).section;
		        		if (opt.viewSelectedSectionCallback && angular.isFunction(opt.viewSelectedSectionCallback)) {
		        			opt.viewSelectedSectionCallback(section.timeRange, section.externalData);
		        		}

				    }],
				    null,
				    deleteItem
				];

				scope.sectionEnter = function(index) {
					scope.highlightedSection = true;
					scope.$broadcast('ns:popover:hide');
					createDisplayPopover(index);
		        	var section = scope.tl_sections[index];
		        	if (section) {
		        		section.sectionShape.startNode.shouldHide = false;
		        		section.sectionShape.endNode.shouldHide = false;
		        		if (index + 1 < scope.tl_sections.length) {
		        			scope.tl_sections[index + 1].sectionShape.startNode.shouldHide = true;
		        		}
		        		if (index - 1 >= 0) {
		        			scope.tl_sections[index - 1].sectionShape.endNode.shouldHide = true;
		        		}
		        	}
				}

				scope.sectionLeave = function (index) {
					scope.highlightedSection = false;
		        	hideSectionNode();
				}

				scope.$on('ngDialog.opened', function () {
					scope.$broadcast('pickerUpdate', 'endTimeInput', {
						minDate: new moment(scope.currentSelectSection.timeRange.start),
						maxDate: new moment(scope.currentSelectSection.timeRange.end)
					})
				});

				element.on('contextmenu', function (event) {
					if (!scope.highlightedSection) return;
					var eventData = {
						pageX: event.originalEvent.pageX,
						pageY: event.originalEvent.pageY,
						currentTarget: event.originalEvent.currentTarget,
						view: event.originalEvent.view,
						target: event.originalEvent.target
					}
	            	contextMenu.trigger("contextmenu", eventData);
					return false;
				});
			}
		}
	};

});