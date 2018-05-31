define([], function() {
    return function regState(mod) {
        mod.config([ "$stateProvider", function($stateProvider) {
            $stateProvider.state("welcome", {
                "abstract": true,
                url: "/welcome",
                template: "<ui-view/>"
            }).state("welcome.summary", {
                "abstract": true,
                url: "/summary",
                template: "<ui-view/>"
            }).state("welcome.summary.view", {
                url: "/view",
                templateUrl: "./components/welcome/welcome.summary.view.html",
                params: {
                    data: ""
                },
                controller: "welcome.summary.view.ctrl",
                controllerAs: "context"
            });
        } ]);
        return mod;
    };
});