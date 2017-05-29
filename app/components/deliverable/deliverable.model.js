var app = app || {};

(function () {

    app.deliverable = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL + 'deliverable/' + 'details?deliverableId=' + app.selectedDeliverableId + "&userId=" + app.user.userId;
                },
                beforeSend: app.setRequestHeader
            },
            update: {
                url: function () {
                    return WS_BASE_URL + 'deliverable/' + app.selectedDeliverable.id;
                },
                beforeSend: app.setRequestHeader,
                type: "PATCH",
                contentType: "application/json",
            },
            parameterMap: function (data, operation) {

                if (operation === 'update') {

                    var theme = data.deliverableTheme ? data.deliverableTheme.id : 1;
                    var type = data.deliverableType ? data.deliverableType.id : 1;
                    var status  = data.status ? data.status.id : 1;
                    var securityClassification = data.securityClassification ? data.securityClassification.id : 1;

                    var model = {
                        name: data.name,
                        issueDate: data.issueDate,
                        deliverableTheme: WS_BASE_URL + 'deliverabletheme/' + theme,
                        deiverableType: WS_BASE_URL + 'deliverabletype/' + type,
                        status: WS_BASE_URL + 'status/' + status,
                        securityClassificaiton: WS_BASE_URL + 'securityclassification/' + securityClassification
                    };

                    return kendo.stringify(model);
                }
            }
        },
        schema: {
            model: {
                id: "id",
                fields: {
                    id: {
                        from: "id",
                        type: "number",
                        editable: false
                    },
                    title: {
                        from: 'name',
                        type: "string",
                        validation: {
                            required: true
                        }
                    },
                    issueDate: {
                        from: 'issueDate',
                        type: 'date',
                        validation: {
                            required: true
                        }
                    },
                    type: {
                        from: 'deliverableType',
                        type: 'object'
                    },
                    theme: {
                        from: 'deliverableTheme',
                        type: 'object'
                    },
                }
            },
            errors: 'error'
        },
        error: function (e) {
            if (e.xhr.responseJSON)
                $("#deliverable-notification").data("kendoNotification").error(e.xhr.responseJSON.message);
            else
                $("#deliverable-notification").data("kendoNotification").error(e.status + ": Can not get deliverable meta-data.");
        },
        serverFiltering: true,
    });

})()