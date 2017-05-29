var app = app || {};

(function () {

    app.typeModel = new kendo.data.DataSource({
			transport: {
				read: {
					url: WS_BASE_URL + "deliverabletype",
					beforeSend: app.setRequestHeader
				}
			},
			schema: {
				data: "_embedded.deliverabletype",
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