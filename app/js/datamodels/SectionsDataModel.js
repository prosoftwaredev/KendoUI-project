var SectionsDataModel;
(function() {    
    SectionsDataModel = function SectionsDataModel(deliverableID) {		
		this._uriServices = {
			"GET" : WS_BASE_URL + "section/" +deliverableID+ "/sections", // create web service			
		};
		
		this._sectionID = null;
		if ((typeof deliverableID != "undefined") && (deliverableID != null)) {
			this._sectionID = deliverableID;
		}
		
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
	
	SectionsDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	SectionsDataModel.prototype.GetSectionID = function() {
		return this._projectID;
	}
	SectionsDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	// Setters
	SectionsDataModel.prototype.SetId = function(id) {
		this._id = id;
	}	
	// Operations
	SectionsDataModel.prototype.AddSection = function(section, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new section in local dataSource
			this._dataSource.pushCreate(JSON.parse(section.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new section in server
			return section.Create();
		}
	}
	SectionsDataModel.prototype.UpdatePhase = function(section, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update section in local dataSource
			if(this._dataSource.get(section.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(section.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update section in server
			return section.Update();
		}
	}
	SectionsDataModel.prototype.DeletePhase = function(section, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove section from local dataSource
			if(this._dataSource.get(section.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(section.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove section from server
			return section.Delete();
		}
	}
	
	SectionsDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get SectionsDataModel : " + jqXHR.statusText);
			});
	}
	
	SectionsDataModel.prototype.fromJSON = function(jsonObject) {
		this._dataSource.data(jsonObject);
	}
	SectionsDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	SectionsDataModel.prototype.toHTML = function() {				
	}
}());