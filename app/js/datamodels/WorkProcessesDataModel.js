var WorkProcessesDataModel;
(function() {    
    WorkProcessesDataModel = function WorkProcessesDataModel(projectID, organisationID) {		
		this._uriServices = {
			"GET" : { 
						"ALL" : WS_BASE_URL + "workprocess", // get web service
						"BYPRJ" : WS_BASE_URL + "project/",
						"BYORG" : WS_BASE_URL + "organisation/"
					}
		};
		
		this._projectID = null;
		if ((typeof projectID != "undefined") && (projectID != null)) {
			this._projectID = projectID;
		}
		
		this._organisationID = null;
		if ((typeof organisationID != "undefined") && (organisationID != null)) {
			this._organisationID = organisationID;
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
			},
			sort: { field: "id", dir: "asc" }
		});	
		this._removedWPs = [];
	};
	
	WorkProcessesDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	WorkProcessesDataModel.prototype.GetProjectId = function() {
		return this._projectID;
	}
	WorkProcessesDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	// Setters
	WorkProcessesDataModel.prototype.SetId = function(id) {
		this._id = id;
	}	
	// Operations
	WorkProcessesDataModel.prototype.IsWPExist = function(name) {
		var exist = false;
		$.each(this._dataSource.data().toJSON(), function(index, value){
			if (value.name == name) {
				exist = true;
			}
		});
		
		return exist;
	}
	WorkProcessesDataModel.prototype.AddWorkProcess = function(workProcess, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new workProcess in local dataSource
			this._dataSource.pushCreate(JSON.parse(workProcess.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new workProcess in server
			return workProcess.Create();
		}
	}
	WorkProcessesDataModel.prototype.UpdateWorkProcess = function(workProcess, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update workProcess in local dataSource
			if(this._dataSource.get(workProcess.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(workProcess.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update workProcess in server
			return workProcess.Update();
		}
	}
	WorkProcessesDataModel.prototype.DeleteWorkProcess = function(workProcess, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove workProcess from local dataSource
			if(this._dataSource.get(workProcess.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(workProcess.toJSON()));
				this._removedWPs.push({id:workProcess.GetId(), name:workProcess.GetName()});
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove workProcess from server
			return workProcess.Delete();
		}
	}
	
	WorkProcessesDataModel.prototype.DeleteWPsFromServer = function(){
		if (this._removedWPs.length > 0) {
			var aWPObj = new WorkProcessDataModel();
			this._removedWPs.forEach(function(item, index){
				aWPObj.SetId(item.id);
				aWPObj.SetName(item.name);
				aWPObj.Delete().done(function(){
					showNotification(item.name + " successfully removed", "success");
				}).fail(function(){
					showNotification("Error removing " + item.name, "error");
				});
			});
			this._removedWPs = [];
		}
	}
	
	WorkProcessesDataModel.prototype.Read = function() {
		var url = this._uriServices.GET.ALL;
		if (this._organizationID != null) {
			url = this._uriServices.GET.BYORG + this._organizationID + "/workprocesses";
		}
		if (this._projectID != null) {
			url = this._uriServices.GET.BYPRJ + this._userId + "/workprocesses";
		}
		return sendHttpRequest("GET", url, true, this).done(function(result){
				if (('_embedded' in result) && ('workprocess' in result._embedded)) {
					this.fromJSON(result._embedded.workprocess);
					this._removedWPs = [];
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get WorkProcessesDataModel : " + jqXHR.statusText);
			});
	}
	
	WorkProcessesDataModel.prototype.fromJSON = function(jsonObject) {
		this._dataSource.data(jsonObject);
	}
	WorkProcessesDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	WorkProcessesDataModel.prototype.toHTML = function() {				
	}
}());