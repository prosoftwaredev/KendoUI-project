var app = app || {};

(function () {

    app.listOfDeliverables = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + 'project/' + app.project.id + "/deliverables";
                },
                beforeSend: app.setRequestHeader
            }
        },
        pageSize: 5,
        schema: {
            data: "_embedded.deliverable",
            total: '_embedded.deliverable.length',
            model: {
                id: "id",
                fields: {
                    id: { from: "id", type: "number", editable: false },
                    // other fields
                }
            }
        },
    });


})()