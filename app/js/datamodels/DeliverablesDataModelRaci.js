var DeliverablesDataModel;
(function() {    
    DeliverablesDataModel = function DeliverablesDataModel() {		
		this._uriServices = {
			"GET" : "https://demo1085850.mockable.io/deliverables", // create web service			
		};
		

		
		this._dataSource = new kendo.data.DataSource({
			data: [],
			schema: {
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
	
	DeliverablesDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	/* DeliverablesDataModel.prototype.GetProjectId = function() {
		return this._projectID;
	} */
	DeliverablesDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	// Setters
	DeliverablesDataModel.prototype.SetId = function(id) {
		this._id = id;
	}	
	// Operations
	DeliverablesDataModel.prototype.AddDeliverable = function(deliverable, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new deliverable in local dataSource
			this._dataSource.pushCreate(JSON.parse(deliverable.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new deliverable in server
			return deliverable.Create();
		}
	}
	DeliverablesDataModel.prototype.UpdateDeliverable = function(deliverable, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update deliverable in local dataSource
			if(this._dataSource.get(deliverable.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(deliverable.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update deliverable in server
			return deliverable.Update();
		}
	}
	DeliverablesDataModel.prototype.DeleteDeliverable = function(deliverable, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove deliverable from local dataSource
			if(this._dataSource.get(deliverable.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(deliverable.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove deliverable from server
			return deliverable.Delete();
		}
	}
	
	DeliverablesDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get DeliverablesDataModel : " + jqXHR.statusText);
			});
	}
	
	DeliverablesDataModel.prototype.fromJSON = function(jsonObject) {
		this._dataSource.data(jsonObject);
	}
	DeliverablesDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	DeliverablesDataModel.prototype.toHTML = function() {				
	}
}());