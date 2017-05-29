var app = app || {};

(function () {

    app.revisionsModel = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + "section/" + app.selectedSection.id + "/sectionRevisions";
                },
                beforeSend: app.setRequestHeader
            }
        },
        schema: {
            data: '_embedded.sectionrevision'
        }
    });

})()