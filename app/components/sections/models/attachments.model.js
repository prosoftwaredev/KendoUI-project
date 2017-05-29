var app = app || {};

(function () {

    app.attachmentsModel = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + "section/" + app.selectedSection.id + "/files";
                },
                beforeSend: app.setRequestHeader
            },
            update: {
                url: function () {
                    return WS_BASE_URL + 'file/' + app.selectedAttachment.id
                },
                type: 'PATCH',
                contentType: "application/json",
                beforeSend: app.setRequestHeader
            },
            create: {
                url: function () {
                    return WS_BASE_URL + 'file'
                },
                type: 'POST',
                contentType: "application/json",
                beforeSend: app.setRequestHeader
            },
            destroy: {
                url: function () {
                    return WS_BASE_URL + 'file/' + app.selectedAttachmentId
                },
                type: 'DELETE',
                beforeSend: app.setRequestHeader
            },
            parameterMap: function (data, operation) {
                if (operation === "create") {

                    var model = {
                        name: data.name,
                        extension: data.extension,
                        creationDate: data.creationDate,
                        uploadDate: data.uploadDate,
                        size: data.size,
                        organisation: WS_BASE_URL + 'organization/' + app.user.organizationId,
                        section: WS_BASE_URL + 'section/' + app.selectedSection.id,
                        project: WS_BASE_URL + "project/" + app.project.id,
                        path: 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf'
                    };

                    return kendo.stringify(model);
                }

                if (operation === 'update') {

                    var model = {
                        name: data.name
                    };

                    return kendo.stringify(model);
                }

                return data;
            }
        },
        schema: {
            parse: function (data) {
                if (data._embedded) {
                    return data._embedded.file;
                }
                return data;
            },
            model: {
                id: 'id'
            },

        }
    });

})()