var app = app || {};

(function () {

    app.router = new kendo.Router({
        routeMissing: function (e) {
            console.log("non existing route: " + e.url);
        },
        change: function (e) {

            // here custom authentication or authorization logic can be added
            // e.preventDefault();
        }
    });

    app.addRoute = function (state, routeOptions) {

        app.user = getUserInformationBase64();
        // In order to be able to map custom states to routes that want to be shown
        // all routes will be mapped in app.routes collection
        // So if routes colleciton already exist ok otherwise here new colleciton will be initiated
        app.routes = app.routes || {};

        // Actual mapping happens here
        app.routes[state] = routeOptions.uri;

        // Route to Telerik router object is being created
        app.router.route(routeOptions.uri, function () {

            // Telerik MVVM model is created, later it will be passed to the view and the controller
            routeOptions.viewModel = kendo.observable({
                "userAvatar": app.user.userAvatar
            });

            app.viewLoaderService.loadView(routeOptions)
                .then(function () {

                    var controllerStart = app[routeOptions.controller];

                    controllerStart(routeOptions.viewModel);
                });
        });
    };

    app.navigate = function (route) {

        var uri = app.routes[route];

        app.router.navigate(uri);
    };

    app.addDafaultRoutes = function () {
        app.addRoute('Deliverables', {
            uri: 'deliverables',
            templateUri: '/components/deliverable/deliverable.view.html',
            templateId: 'deliverable-page-template',
            controller: 'deliverableController',
        });
        app.addRoute('DeliverableSections', {
            uri: 'deliverable/sections',
            templateUri: '/components/sections/sections.view.html',
            templateId: 'sections-page-template',
            controller: 'sectionsController',
        });
		app.addRoute('SectionsStandalone', {
            uri: 'sectionsStandalone',
            templateUri: '/components/sectionsStandalone/sections.view.html',
            templateId: 'sections-page-template',
            controller: 'sectionsSTDController',
        });
    };

    app.addDafaultRoutes();

    app.router.start();


})();




