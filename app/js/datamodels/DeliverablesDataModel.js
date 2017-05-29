var DeliverablesDataModel;
(function() {
    DeliverablesDataModel = function DeliverablesDataModel(projectID,phaseID) {
		this._uriServices = {
      "GET" : {
        "ALL" : WS_BASE_URL + "phase", // create web service
        "BYPRJ" : WS_BASE_URL + "project/",
         "BYPHASE" : WS_BASE_URL + "phase/"

      },
      "POST" : {
        "ALL" : WS_BASE_URL + "phase", // create web service
        "BYPRJ" : WS_BASE_URL + "project/",
        "BYPHASE" : WS_BASE_URL + "phase/"
      },
			"PATCH" : {
        "ALL" : WS_BASE_URL + "phase", // create web service
        "BYPRJ" : WS_BASE_URL + "project/",
        "BYPHASE" : WS_BASE_URL + "phase/"
      },
		};

      this._projectID = null;
      if ((typeof projectID != "undefined") && (projectID != null)) {
        this._projectID = projectID;
      }

      this._phaseID = null;
      if ((typeof phaseID != "undefined") && (phaseID != null)) {
        this._phaseID = phaseID;
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

	DeliverablesDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	DeliverablesDataModel.prototype.GetProjectId = function() {
		return this._projectID;
	}
  DeliverablesDataModel.prototype.GetPhaseId = function() {
    return this._phaseID;
  }
  DeliverablesDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	// Setters
	DeliverablesDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
  DeliverablesDataModel.prototype.SetProjectId = function(projectId) {
    this._projectID = projectId;
  }
  DeliverablesDataModel.prototype.SetPhaseId = function(phaseId) {
    this._phaseID = phaseId;
  }
	// Operations
	DeliverablesDataModel.prototype.AddDeliverable = function(deliverable, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new deliverable in local dataSource
      if(this._dataSource.get(deliverable.GetId()) != null) {
        return false;
      }else {
        this._dataSource.pushCreate(JSON.parse(deliverable.toJSON()));
        return true;
      }
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new deliverable in server
			return deliverable.Create();
		}
	}
	DeliverablesDataModel.prototype.UpdateDeliverable = function(deliverable, mode) {
		debugger;
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

  DeliverablesDataModel.prototype.getDeliverable = function(id){
    return this._dataSource.get(id) ;
  }

	DeliverablesDataModel.prototype.Read = function() {
    var url = this._uriServices.GET.ALL;
    if ((this._projectID != null)&&(this._phaseID != null)) {
      url = this._uriServices.GET.BYPHASE + this._phaseID + "/deliverablesdetails";
    }else if(this._projectID != null)
    {
      url = this._uriServices.GET.BYPRJ + this._projectID + "/deliverables";
    }
    return sendHttpRequest("GET", url, true, this).done(function(result){
      if (typeof result == "object" && "_embedded" in result) {
		     if (typeof result._embedded == "object" && "deliverable" in result._embedded) {
				  if(result._embedded.deliverable != null){
						 this.fromJSON(result._embedded.deliverable);
				  }
			 }
      }else {
        this.fromJSON(result);
      }
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Get DeliverablesModel : " + jqXHR.statusText);
    });
	}

  DeliverablesDataModel.prototype.Create = function() {
    var url = this._uriServices.POST.ALL;
    if ((this._projectID != null)&&(this._phaseID != null)) {
      url = this._uriServices.POST.BYPHASE + this._phaseID + "/deliverables";
    }else if(this._projectID != null)
    {
      url = this._uriServices.POST.BYPRJ + this._projectID + "/deliverables";
    }

    return sendHttpRequestURI("PUT",url, true,this,this.toURI()).done(function(result){
    console.log("create deliverable ok");
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Create DeliverablesModel : " + jqXHR.statusText);
    });
  }

	  DeliverablesDataModel.prototype.Update = function() {
    var url = this._uriServices.PATCH.ALL;
    if ((this._projectID != null)&&(this._phaseID != null)) {
      url = this._uriServices.PATCH.BYPHASE + this._phaseID + "/deliverables";
    }else if(this._projectID != null)
    {
      url = this._uriServices.PATCH.BYPRJ + this._projectID + "/deliverables";
    }

    return sendHttpRequestURI("PATCH",url, true,this,this.toURI()).done(function(result){
    console.log("update deliverable ok");
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Update DeliverablesModel : " + jqXHR.statusText);
    });
  }

	DeliverablesDataModel.prototype.fromJSON = function(jsonObject) {
    if((typeof jsonObject != "undefined") && (jsonObject != null)&&(jsonObject != "")) {
      this._dataSource.data(jsonObject);
    }
	}
	DeliverablesDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
  DeliverablesDataModel.prototype.toURI = function() {
    var uri="";
    for(var i=0;i<this._dataSource.data().length;i++){
      uri=uri+WS_BASE_URL + "deliverable/"+this._dataSource.data()[i].id+"\n";
    }
    console.log(uri);
    return uri;
    //return WS_BASE_URL + "deliverable/4"
  }
	DeliverablesDataModel.prototype.toHTML = function() {
	}
}());
