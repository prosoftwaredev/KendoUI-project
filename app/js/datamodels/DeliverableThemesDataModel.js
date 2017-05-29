var DeliverableThemesDataModel;
(function () {
	DeliverableThemesDataModel = function DeliverableThemesDataModel() {
		this._uriServices = {
			"GET": WS_BASE_URL + "deliverabletheme"
		};

		this._dataSource = new kendo.data.DataSource({
			transport: {
				read: {
					url: this._uriServices.GET,
					beforeSend: function (req) {
						var auth = getCurrentAuthentificationBase64();
						if (auth != null) {
							req.setRequestHeader('Authorization', "Basic " + auth);
						}
					}
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
	};

	DeliverableThemesDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	DeliverableThemesDataModel.prototype.GetDataSource = function () {
		return this._dataSource;
	}
	// Operations
	DeliverableThemesDataModel.prototype.AddDeliverableThemesDataModel = function (delivThemes, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new DeliverableThemesDataModelin local dataSource
			this._dataSource.pushCreate(JSON.parse(delivThemes.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new DeliverableThemesDataModelin server
			return delivThemes.Create();
		}
	}
	DeliverableThemesDataModel.prototype.UpdateDeliverableThemesDataModel = function (delivThemes, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update DeliverableThemesDataModelin local dataSource
			if (this._dataSource.get(delivThemes.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(delivThemes.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update DeliverableThemesDataModelin server
			return delivThemes.Update();
		}
	}
	DeliverableThemesDataModel.prototype.DeleteDeliverableThemesDataModel = function (delivThemes, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove DeliverableThemesDataModelfrom local dataSource
			if (this._dataSource.get(delivThemes.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(delivThemes.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove DeliverableThemesDataModelfrom server
			return delivThemes.Delete();
		}
	}

	DeliverableThemesDataModel.prototype.getDeliverableThemesDataModel = function (id) {
		return this._dataSource.get(id);
	}



	DeliverableThemesDataModel.prototype.Read = function () {
		var url = this._uriServices.GET;
		return sendHttpRequest("GET", url, true, this).done(function (result) {
			console.log(result);
			if (typeof result == "object" && "_embedded" in result) {
				if (typeof result._embedded == "object" && "deliverabletheme" in result._embedded) {
					if (result._embedded.deliverabletheme != null) {
						this.fromJSON(result._embedded.deliverabletheme);
					}
				}
			}
		}).fail(function (jqXHR, textStatus) {
			console.log("Error Get DeliverableThemesDataModel : " + jqXHR.statusText);
		});
	}

	DeliverableThemesDataModel.prototype.fromJSON = function (jsonObject) {
		this._dataSource.data(jsonObject);
	}
	DeliverableThemesDataModel.prototype.toJSON = function () {
		//stringify a DeliverableThemesDataModel object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	DeliverableThemesDataModel.prototype.toHTML = function () {
	}
}());
