var SectionsListDataModel;
(function() {
    SectionsListDataModel = function SectionsListDataModel() {
		this._uriServices = {
			"GET" : WS_BASE_URL + "section"		, // create web service
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

	SectionsListDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	SectionsListDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	// Setters
	SectionsListDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	// Operations
	SectionsListDataModel.prototype.AddSection = function(section, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new section in local dataSource
			this._dataSource.pushCreate(JSON.parse(section.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new section in server
			return section.Create();
		}
	}
	SectionsListDataModel.prototype.UpdateSection = function(section, mode) {
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
	SectionsListDataModel.prototype.DeleteSection = function(section, mode){
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

	SectionsListDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET, true, this).done(function(result){
			if (typeof result == "object" && "_embedded" in result) {
					 if (typeof result._embedded == "object" && "section" in result._embedded) {
						  if(result._embedded.section != null){
								 this.fromJSON(result._embedded.section);
						  }
					 }
			  }
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get SectionsListDataModel : " + jqXHR.statusText);
			});
	}

  SectionsListDataModel.prototype.ReadSection = function(sectionId) {
    var url = this._uriServices.GET + "/" + sectionId;
    return sendHttpRequest("GET", url, true, this).done(function(result){
          if(result){
            this.fromJSON(result);
          }
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Get SectionsListDataModel : " + jqXHR.statusText);
    });
  }

	SectionsListDataModel.prototype.fromJSON = function(jsonObject) {
		this._dataSource.data(jsonObject);
	}
	SectionsListDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	SectionsListDataModel.prototype.toHTML = function() {
	}
}());
