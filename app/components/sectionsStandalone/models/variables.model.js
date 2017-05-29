var app = app || {};

(function () {

    app.variablesModel = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: WS_BASE_URL + "projectvariable",
                        beforeSend: app.setRequestHeader
                    }
                },
                schema: {
                    data: "_embedded.projectvariable"

                }
            });

})()