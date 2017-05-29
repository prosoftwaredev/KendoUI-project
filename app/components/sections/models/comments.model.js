var app = app || {};

(function () {

    app.commentsModel = new kendo.data.DataSource({
        autoSync: true,
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + "section/" + app.selectedSection.id + "/comments";
                },
                beforeSend: app.setRequestHeader
            },
            create: {
                url: function () {
                    return WS_BASE_URL + "comment";
                },
                type: 'POST',
                contentType: "application/json",
                beforeSend: app.setRequestHeader
            },
            update: {
                url: function (e) {
                    return WS_BASE_URL + "comment/" + e.id;
                },
                type: 'PATCH',
                contentType: "application/json",
                beforeSend: app.setRequestHeader
            },
            parameterMap: function (data, operation) {
                if (operation === "create") {

                    var model = {
                        organisation: WS_BASE_URL + 'organization/' + app.user.organizationId,
                        project: WS_BASE_URL + "project/" + app.project.id,
                        user: WS_BASE_URL + 'user/' + app.user.userId,
                        section: WS_BASE_URL + 'section/' + app.selectedSection.id,
                        value: data.value,
                        resolution: data.resolution,
                        uuid: data.uuid
                    };

                    return kendo.stringify(model);
                }

                if (operation === 'update') {

                    var model = {
                        resolution: data.resolution
                    };

                    return kendo.stringify(model);
                }

                return data;
            }
        },
        schema: {
            parse: function (data) {
                if (data._embedded) {
                    return data._embedded.comment;
                }
                return data;
            },
            model: {
                id: 'id'
            },

        }
    });

})()