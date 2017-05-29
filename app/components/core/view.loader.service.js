var app = app || {};

(function ($) {

    app.viewLoaderService = {

        loadView: function (viewOptions) {

            var templateExist = document.getElementById(viewOptions.templateId) != null;

            if (templateExist) {

                var dfd = $.Deferred();

                this._renderView(viewOptions);

                return dfd.resolve().promise();
            }

            else {

                return $.get(viewOptions.templateUri)

                    .then(function (template) {

                        var templateContainer = "#templates-content"

                        $(templateContainer).append(template);

                        app.viewLoaderService._renderView(viewOptions);
                    });
            }
        },

        _renderView: function (viewOptions) {

            var view = new kendo.View(viewOptions.templateId, { model: viewOptions.viewModel });

            var viewContainer = "#pagecontent";

            $(viewContainer).empty();
            view.render(viewContainer);
        }
    }
})(jQuery);
