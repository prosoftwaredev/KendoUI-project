var DeliverableTypesModel;
(function () {
	DeliverableTypesModel = function DeliverableTypesModel() {
		this._uriServices = {
			"GET": WS_BASE_URL + "deliverabletype"
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
	};

	DeliverableTypesModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	DeliverableTypesModel.prototype.GetDataSource = function () {
		return this._dataSource;
	}
	// Operations
	DeliverableTypesModel.prototype.AddDeliverableTypesModel = function (SecurityClass, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new DeliverableTypesModelin local dataSource
			this._dataSource.pushCreate(JSON.parse(SecurityClass.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new DeliverableTypesModelin server
			return SecurityClass.Create();
		}
	}
	DeliverableTypesModel.prototype.UpdateDeliverableTypesModel = function (SecurityClass, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update DeliverableTypesModelin local dataSource
			if (this._dataSource.get(SecurityClass.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(SecurityClass.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update DeliverableTypesModelin server
			return SecurityClass.Update();
		}
	}
	DeliverableTypesModel.prototype.DeleteDeliverableTypesModel = function (SecurityClass, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove DeliverableTypesModelfrom local dataSource
			if (this._dataSource.get(SecurityClass.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(SecurityClass.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove DeliverableTypesModelfrom server
			return SecurityClass.Delete();
		}
	}

	DeliverableTypesModel.prototype.getDeliverableTypesModel = function (id) {
		return this._dataSource.get(id);
	}



	DeliverableTypesModel.prototype.Read = function () {
		var url = this._uriServices.GET;
		return sendHttpRequest("GET", url, true, this).done(function (result) {
			console.log(result);
			if (typeof result == "object" && "_embedded" in result) {
				if (typeof result._embedded == "object" && "deliverabletype" in result._embedded) {
					if (result._embedded.deliverabletype != null) {
						this.fromJSON(result._embedded.deliverabletype);
					}
				}
			}
		}).fail(function (jqXHR, textStatus) {
			console.log("Error Get DeliverableTypesModel : " + jqXHR.statusText);
		});
	}

	DeliverableTypesModel.prototype.fromJSON = function (jsonObject) {
		this._dataSource.data(jsonObject);
	}
	DeliverableTypesModel.prototype.toJSON = function () {
		//stringify a DeliverableTypesModel object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	DeliverableTypesModel.prototype.toHTML = function () {
	}
}());
