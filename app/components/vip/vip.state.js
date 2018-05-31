define([], function() {
    return function regState(mod) {
        mod.config([ "$stateProvider", function($stateProvider) {
            $stateProvider.state("vip", {
                "abstract": true,
                url: "/vip",
                template: "<ui-view/>"
            }).state("vip.list", {
                "abstract": true,
                url: "/list",
                template: "<ui-view/>"
            }).state("vip.list.edit", {
                url: "/edit",
                templateUrl: "./components/vip/vip.list.edit.html",
                params: {
                    data: ""
                },
                controller: "vip.list.edit.ctrl",
                controllerAs: "context"
            }).state("vip.list.view", {
                url: "/view",
                templateUrl: "./components/vip/vip.list.view.html",
                params: {
                    data: ""
                },
                controller: "vip.list.view.ctrl",
                controllerAs: "context"
            });
        } ]);
        return mod;
    };
});