var PhasesDataModel;
(function() {    
    PhasesDataModel = function PhasesDataModel(projectID) {		
		this._uriServices = {
			"GET" : { 
						"ALL" : WS_BASE_URL + "phase", // create web service
						"BYPRJ" : WS_BASE_URL + "project/"
					}
		};
		
		this._projectID = null;
		if ((typeof projectID != "undefined") && (projectID != null)) {
			this._projectID = projectID;
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
			sort: { field: "rank", dir: "asc" }
		});	
		this._removedPhases = [];
		this._newRanks = [];
	};
	
	PhasesDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	PhasesDataModel.prototype.GetProjectId = function() {
		return this._projectID;
	}
	PhasesDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	PhasesDataModel.prototype.GetNewRank = function() {
		var newRank = 0;
		$.each(this._dataSource.data().toJSON(), function(index, value){
			if (value.rank > newRank) {
				newRank = value.rank;
			}
		});
		
		return newRank+1;
	}
	// Setters
	PhasesDataModel.prototype.SetProjectId = function(id) {
		this._projectID = id;
	}	
	// Operations
	PhasesDataModel.prototype.IsPhaseExist = function(name) {
		var exist = false;
		$.each(this._dataSource.data().toJSON(), function(index, value){
			if (value.name == name) {
				exist = true;
			}
		});
		
		return exist;
	}
	PhasesDataModel.prototype.AddPhase = function(phase, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new phase in local dataSource
			this._dataSource.pushCreate(JSON.parse(phase.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new phase in server
			return phase.Create();
		}
	}
	PhasesDataModel.prototype.UpdatePhase = function(phase, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update phase in local dataSource
			if(this._dataSource.get(phase.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(phase.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update phase in server
			return phase.Update();
		}
	}
	PhasesDataModel.prototype.UpdatePhasesRank = function(phase, mode) {
		if(this._newRanks.length > 0) {
			var aPhaseObj = new PhaseDataModel();
			this._newRanks.forEach(function(item, index){
				aPhaseObj.SetId(item.id);
				aPhaseObj.SetName(item.name);
				aPhaseObj.SetRank(item.rank);
				aPhaseObj.UpdateRank().done(function(){
					showNotification(item.name + " rank successfully updated", "success");
				}).fail(function(){
					showNotification("Error updating " + item.name + " rank", "error");
				});
			});
		}
	}
	PhasesDataModel.prototype.DeletePhase = function(phase, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove phase from local dataSource
			if(this._dataSource.get(phase.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(phase.toJSON()));
				this._removedPhases.push({id:phase.GetId(), name:phase.GetName()});
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove phase from server
			return phase.Delete();
		}
	}
	PhasesDataModel.prototype.DeletePhasesFromServer = function(){
		if (this._removedPhases.length > 0) {
			var aPhaseObj = new PhaseDataModel();
			this._removedPhases.forEach(function(item, index){
				aPhaseObj.SetId(item.id);
				aPhaseObj.SetName(item.name);
				aPhaseObj.Delete().done(function(){
					showNotification(item.name + " successfully removed", "success");
				}).fail(function(){
					showNotification("Error removing " + item.name, "error");
				});
			});
			this._removedPhases = [];
		}
	}
	
	PhasesDataModel.prototype.Read = function() {
		var url = this._uriServices.GET.ALL;
		if (this._projectID != null) {
			url = this._uriServices.GET.BYPRJ + this._projectID + "/phases";
		}	
		return sendHttpRequest("GET", url, true, this).done(function(result){
				if (('_embedded' in result) && ('phase' in result._embedded)) {
					this.fromJSON(result._embedded.phase);
				}
				this._removedPhases = [];
				this._newRanks = [];
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get PhasesDataModel : " + jqXHR.statusText);
			});
	}
	
	PhasesDataModel.prototype.fromJSON = function(jsonObject) {
		this._dataSource.data(jsonObject);
	}
	PhasesDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	PhasesDataModel.prototype.toHTML = function() {				
	}
}());