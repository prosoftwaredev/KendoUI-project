var SecurityClassificationsDataModel;
(function () {
	SecurityClassificationsDataModel = function SecurityClassificationsDataModel() {
		this._uriServices = {
			"GET": WS_BASE_URL + "securityclassification"
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
	};

	SecurityClassificationsDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	SecurityClassificationsDataModel.prototype.GetDataSource = function () {
		return this._dataSource;
	}
	// Operations
	SecurityClassificationsDataModel.prototype.AddSecurityClassificationsDataModel = function (SecurityClass, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new SecurityClassificationsDataModelin local dataSource
			this._dataSource.pushCreate(JSON.parse(SecurityClass.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new SecurityClassificationsDataModelin server
			return SecurityClass.Create();
		}
	}
	SecurityClassificationsDataModel.prototype.UpdateSecurityClassificationsDataModel = function (SecurityClass, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update SecurityClassificationsDataModelin local dataSource
			if (this._dataSource.get(SecurityClass.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(SecurityClass.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update SecurityClassificationsDataModelin server
			return SecurityClass.Update();
		}
	}
	SecurityClassificationsDataModel.prototype.DeleteSecurityClassificationsDataModel = function (SecurityClass, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove SecurityClassificationsDataModelfrom local dataSource
			if (this._dataSource.get(SecurityClass.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(SecurityClass.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove SecurityClassificationsDataModelfrom server
			return SecurityClass.Delete();
		}
	}

	SecurityClassificationsDataModel.prototype.getSecurityClassificationsDataModel = function (id) {
		return this._dataSource.get(id);
	}



	SecurityClassificationsDataModel.prototype.Read = function () {
		var url = this._uriServices.GET;
		return sendHttpRequest("GET", url, true, this).done(function (result) {
			console.log(result);
			if (typeof result == "object" && "_embedded" in result) {
				if (typeof result._embedded == "object" && "securityclassification" in result._embedded) {
					if (result._embedded.securityclassification != null) {
						this.fromJSON(result._embedded.securityclassification);
					}
				}
			}
		}).fail(function (jqXHR, textStatus) {
			console.log("Error Get SecurityClasssModel : " + jqXHR.statusText);
		});
	}

	SecurityClassificationsDataModel.prototype.fromJSON = function (jsonObject) {
		this._dataSource.data(jsonObject);
	}
	SecurityClassificationsDataModel.prototype.toJSON = function () {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	SecurityClassificationsDataModel.prototype.toHTML = function () {
	}
}());
