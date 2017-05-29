var app = app || {};

(function () {

    app.securityClassificationModel = new kendo.data.DataSource({
			transport: {
				read: {
					url: WS_BASE_URL + "securityclassification",
					beforeSend: app.setRequestHeader
				}
			},
			schema: {
				data: "_embedded.securityclassification",
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