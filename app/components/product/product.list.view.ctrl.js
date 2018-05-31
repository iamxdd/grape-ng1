define([ "./product.di.list.view" ], function(di) {
    return {
        __register__: function(mod) {
            mod.controller(di.ctrlName, di.diList.concat([ productListViewCtrl ]));
            return mod;
        }
    };
    /** TODO: Add your logic code. */
    function productListViewCtrl($scope, $rootScope, $http, GrapeBaseLogic) {

        var self = this;
    	var data = [
    		{
    			id: 1,
    			price: 12.01,
    			category: '苏菜1',
    		},
    		{
    			id: 2,
    			price: 12.06,
    			category: '苏菜2',
    		},
    		{
    			id: 3,
    			price: 12.02,
    			category: '苏菜3',
    		},
    		{
    			id: 4,
    			price: 12.09,
    			category: '苏菜ads4',
    		},
    		{
    			id: 5,
    			price: 12.09,
    			category: '苏菜ea4',
    		},
    		{
    			id: 6,
    			price: 12.09,
    			category: '苏菜aw4',
    		},
    		{
    			id: 7,
    			price: 12.09,
    			category: '苏菜va4',
    		},
    		{
    			id: 8,
    			price: 12.09,
    			category: '苏菜asd4',
    		},
    		{
    			id: 9,
    			price: 12.09,
    			category: '苏菜asdf4',
    		},
    		{
    			id: 10,
    			price: 12.09,
    			category: '苏菜4',
    		},
    		{
    			id: 11,
    			price: 12.09,
    			category: '苏菜f4',
    		},
    		// {
    		// 	id: 12,
    		// 	price: 12.09,
    		// 	category: '苏菜1a4',
    		// },
    		// {
    		// 	id: 13,
    		// 	price: 12.09,
    		// 	category: '苏菜4',
    		// },
    		// {
    		// 	id: 14,
    		// 	price: 12.09,
    		// 	category: '苏菜41',
    		// },
    		// {
    		// 	id: 15,
    		// 	price: 12.09,
    		// 	category: '苏菜44',
    		// },
    		// {
    		// 	id: 16,
    		// 	price: 12.09,
    		// 	category: '苏菜24',
    		// },
    		// {
    		// 	id: 417,
    		// 	price: 12.09,
    		// 	category: '苏菜54',
    		// }

    	]

        $scope.listheaderSettings = {
            filter: ['category', 'price'],
            search: {display: '请输入XXXXXXXX'},
            customActions: {
                audit:{display: '审核', icon: "fa-legal"}, 
                reject:{display: '审核驳回', icon: "fa-ban"}, 
                onStore:{display: '上架', icon: "fa-check-circle-o"}, 
                offStore:{display: '下架', icon: "fa-times-rectangle-o"},
            },
            audit: function (data, callback) {
                console.log(data);
                callback(true);
            },
            reject: function (data, callback) {
                
            },
            filters: function () {
                return [
                    {
                        name: 'category',
                        display: '类别',
                        type:'common',
                        data: [
                            {Id: -1, Name: '--类别--'},
                            {Id: 1, Name: '新奇玩意儿'},
                            {Id: 2, Name: '天涯明月刀'},
                            {Id: 3, Name: '魔兽世界'},
                            {Id: 4, Name: '刀塔2'},
                        ]
                    },
                    {
                        name: 'author',
                        display: '作者',
                        type:'common',
                        data: [
                            {Id: -1, Name: '--作者--'},
                            {Id: 1, Name: '南派三叔'},
                            {Id: 2, Name: '二月河'},
                            {Id: 3, Name: '南怀瑾'},
                            {Id: 4, Name: '余秋雨'},
                        ]
                    },
                    {
                        name: 'createTime',
                        display: '创建时间',
                        type: 'datetime',
                        min: new Date(),
                    },
                    {
                        name: 'searchTime',
                        display: '搜索时间',
                        type: 'datetime',
                        min: new Date(),
                    },

                ]
            }
        }

        self.opts = {
            apiUrl:'http://localhost:8080/grape/test/data/1/10',
            params: function () {
                return {
                    value: self.userSearchPattern
                }
            }
        }

        self.timelineOptions = function () {
            return {};
        }

        GrapeBaseLogic.cfgTable(this, $scope, self.opts);
        GrapeBaseLogic.cfgSearchBar(this, $scope, self.opts);
    }
});