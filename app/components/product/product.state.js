define([], function() {
    return function regState(mod) {
        mod.config([ "$stateProvider", function($stateProvider) {
            $stateProvider.state("product", {
                "abstract": true,
                url: "/product",
                template: "<ui-view/>"
            }).state("product.list", {
                "abstract": true,
                url: "/list",
                template: "<ui-view/>"
            }).state("product.list.edit", {
                url: "/edit",
                templateUrl: "./components/product/product.list.edit.html",
                params: {
                    data: ""
                },
                controller: "product.list.edit.ctrl",
                controllerAs: "context"
            }).state("product.list.view", {
                url: "/view",
                templateUrl: "./components/product/product.list.view.html",
                params: {
                    data: ""
                },
                controller: "product.list.view.ctrl",
                controllerAs: "context"
            });
        } ]);
        return mod;
    };
});