var app = app || {};

(function () {

    app.themeModel = new kendo.data.DataSource({
			transport: {
				read: {
					url: WS_BASE_URL + "deliverabletheme",
					beforeSend: app.setRequestHeader
				}
			},
			schema: {
				data: "_embedded.deliverabletheme",
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