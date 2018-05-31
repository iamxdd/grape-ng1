define([ "./product.di.list.edit" ], function(di) {
    return {
        __register__: function(mod) {
            mod.controller(di.ctrlName, di.diList.concat([ productListEditCtrl ]));
            return mod;
        }
    };
    /** TODO: Add your logic code. */
    function productListEditCtrl($scope, $http, $state, GrapeBaseLogic) {

        var self = this;

        var recievedData = $state.params.data;
        var lastState = !recievedData.from ? $state.current.name: recievedData.from.name;

        GrapeBaseLogic.cfgEditPage(this, $scope, {
            createUrl: 'http://localhost:8080/product/add',
            updateUrl: 'http://localhost:8080/product/update/123',
            lastState: lastState,
            data: function () {
                return self.editDataModel;
            },
            isSuccess: function (data, action) {
                return true;
            }
        });
        GrapeBaseLogic.cfgWidgets(this, $scope, {
            type: 'select.provider',
            id: 'id_category_selectprovider',
            url:'http://localhost:8080/product/category',
            params: null
        });
        GrapeBaseLogic.cfgWidgets(this, $scope, {
            type: 'image.uploader',
            id: 'id_logo_imguploader',
            uploadUrl: 'http://localhost:8080/images/upload',
            defaultImg: 'http://localhost:8080/images/logo.png',
            readonly: self.viewMode,
            auth: function () {
                return '';
            },
            callback: function (params) {
                
            }
        });
    }
});