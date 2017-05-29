var DeliverableDataModel;
DeliverableDataModel = Object.create(AbstractDataModel.prototype);
(function() {

    DeliverableDataModel = function DeliverableDataModel() {
		AbstractDataModel.apply(this, arguments);
		this._uriServices = {
			"POST" : "", // create web service
			"PUT" : "", // update web service
			"GET" : "", // read web service
			"DELETE" : "", // delete web service
		};

		this._dataSource = new kendo.data.DataSource({
		  transport: {
                read: {
                    dataType: "json",
                    url: "http://demo6413955.mockable.io/listOfDeliverable",
					success: function (data) {
						//console.log(data);
					},
					error: function (xhr, error) {
						console.log(xhr);
					}
                }
            }

		});
	};
	DeliverableDataModel.prototype.Create = function(arguments, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new phase in local dataSource
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new phase in server
		}
	}
	DeliverableDataModel.prototype.Read = function() {
		// Update dataSource with retrieved data from server
		this._dataSource.read();


	}

		DeliverableDataModel.prototype.GetDataSource = function() {
		// Update dataSource with retrieved data from server
		return this._dataSource;
	}
	DeliverableDataModel.prototype.Update = function(arguments, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update phase in local dataSource
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update phase in server
		}
	}
	DeliverableDataModel.prototype.Delete = function(arguments, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// delete phase from local dataSource
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// delete phase from server
		}
	}
	DeliverableDataModel.prototype.toJSON = function() {
		//stringify a phase object : used to send data to server
	}
	DeliverableDataModel.prototype.toHTML = function() {
	}
}());
