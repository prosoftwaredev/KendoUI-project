var app = app || {};

(function () {

    app.impactAnalysis = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: function () {
                            return WS_BASE_URL + "deliverable/findBySection/" + app.selectedSection.id;
                        },
                        beforeSend: app.setRequestHeader
                    }
                },
            });

})()