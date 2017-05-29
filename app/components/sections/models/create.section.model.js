var app = app || {};

(function () {

    app.createSectionList = new kendo.data.DataSource({
        transport: {
            create: {
                url: function () {
                    return WS_BASE_URL + 'section'
                },
                type: 'POST',
                contentType: "application/json",
                beforeSend: app.setRequestHeader
            },
            parameterMap: function (data, operation) {
                if (operation === "create") {

                    var model = {
                        name: data.name,
                        content: "",
                        privatesection: false,
                        organisation: WS_BASE_URL + 'organization/' + app.user.organizationId,
                        project: WS_BASE_URL + "project/" + app.project.id
                    };

                    return kendo.stringify(model);
                }
                return data;
            }
        },
        autoSync: true,
        schema: {
            parse: function(data) {


                debugger;

                return data;
            },
            model: {
                id: 'id'
            }
        }
    });

})()