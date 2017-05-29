var app = app || {};

(function () {

    app.sectionDetails = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + "section/" + app.selectedSection.id
                },
                beforeSend: app.setRequestHeader
            },
            create: {
                url: function () {
                    return WS_BASE_URL + 'section'
                },
                type: 'POST',
                contentType: "application/json",
                beforeSend: app.setRequestHeader
            },
            update: {
                url: function () {
                    return WS_BASE_URL + 'section/' + app.selectedSection.id
                },
                type: 'PATCH',
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

                if (operation === 'update') {

                    var model = {
                        content: data.content,
                    };

                    return kendo.stringify(model);
                }

                return data;
            }
        },
        schema: {
            parse: function (data) {
                return [data];
            }
        }
    });


})()