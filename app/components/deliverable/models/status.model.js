var app = app || {};

(function () {

    app.statusModel = new kendo.data.DataSource({
        transport: {
            read: {
                url: function () {
                    return WS_BASE_URL +
                        'deliverable/possibleTransitions?' +
                        'deliverableId=' + app.selectedDeliverable.id + '&' +
                        'userId=' + app.user.userId + '&' +
                        'phaseId=' + app.selectedDeliverable.phaseId + '&' +
                        'statusId=' + app.selectedDeliverable.status.id;
                },
                beforeSend: app.setRequestHeader
            }
        },
        schema: {
            parse: function (data) {
                data.push(app.selectedDeliverable.status);
                return data;
            },
            model: {
                id: "id",
                fields: {
                    id: { from: "id", type: "number", editable: false },
                    // other fields
                }
            }
        }
    });

})()