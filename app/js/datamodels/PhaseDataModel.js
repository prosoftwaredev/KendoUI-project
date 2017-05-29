var PhaseDataModel;
(function() {    
    PhaseDataModel = function PhaseDataModel(id, name, startDate, endDate, rank, user) {		
		this._uriServices = {
			"POST" : {
				"PHASE" : WS_BASE_URL + "phase", // create web service
				"PROJECT" : WS_BASE_URL + "project/",
				"USER" : WS_BASE_URL + "user/",
				"WP" : WS_BASE_URL + "workprocesses/"
			},
			"PUT" : WS_BASE_URL + "phase", // update web service /{id}
			"GET" : WS_BASE_URL + "phase", // read web service /{id}
			"DELETE" : WS_BASE_URL + "phase" // delete web service /{id}
		};
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}
		this._name = null;
		if ((typeof name != "undefined") && (name != null)) {
			this._name = name;
		}
		this._startDate = null;
		if ((typeof startDate != "undefined") && (startDate != null)) {
			this._startDate = startDate;
		}
		this._endDate = null;
		if ((typeof endDate != "undefined") && (endDate != null)) {
			this._endDate = endDate;
		}
		this._rank = null;
		if ((typeof rank != "undefined") && (rank != null)) {
			this._rank = rank;
		}
		this._gateKeeper = null;
		if ((typeof user != "undefined") && (user != null)) {
			this._gateKeeper = user;
		}
		this._workProcess = null;
		this._deliverables = [];
	};
	PhaseDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	PhaseDataModel.prototype.GetId = function() {
		return this._id;
	}
	PhaseDataModel.prototype.GetName = function() {
		return this._name;
	}
	PhaseDataModel.prototype.GetStartDate = function() {
		return this._startDate;
	}
	PhaseDataModel.prototype.GetEndDate = function() {
		return this._endDate;
	}
	PhaseDataModel.prototype.GetWorkProcess = function() {
		return this._workProcess;
	}
	PhaseDataModel.prototype.GetRank = function() {
		return this._rank;
	}
	PhaseDataModel.prototype.GetGateKeeper = function() {
		return this._gateKeeper;
	}
	PhaseDataModel.prototype.GetDetailsAsObservable = function() {
		return kendo.observable({
			"name" : this._name,
			"startDate":this._startDate,
			"endDate" : this._endDate,
			"user": (this._gateKeeper!=null)?this._gateKeeper.firstname+" "+this._gateKeeper.name:"",
			"used":(this._deliverables.length>0)
		});
	}
	// Setters
	PhaseDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	PhaseDataModel.prototype.SetName = function(name) {
		this._name = name;
	}
	PhaseDataModel.prototype.SetStartDate = function(startDate) {
		this._startDate = startDate;
	}
	PhaseDataModel.prototype.SetEndDate = function(endDate) {
		this._endDate = endDate;
	}
	PhaseDataModel.prototype.SetName = function(name) {
		this._name = name;
	}
	PhaseDataModel.prototype.SetWorkProcess = function(workProcess) {
		this._workProcess = workProcess;
	}
	PhaseDataModel.prototype.SetRank = function(rank) {
		this._rank = rank;
	}
	PhaseDataModel.prototype.SetGateKeeper = function(user) {
		this._gateKeeper = user;
	}

	// Operations
	PhaseDataModel.prototype.Create = function() {
		return sendHttpRequest("POST", this._uriServices.POST.PHASE, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Create PhaseDataModel : " + jqXHR.statusText);
			});
	}	
	PhaseDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Read PhaseDataModel : " + jqXHR.statusText);
			});
	}
	PhaseDataModel.prototype.ReadDeliverables = function() {
		return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id + "/deliverables", true, this).done(function(result){
				if (typeof result == "object") {
					this._deliverables = result._embedded.deliverable;
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error ReadDeliverables PhaseDataModel : " + jqXHR.statusText);
			});
	}
	PhaseDataModel.prototype.Update = function() {
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Update PhaseDataModel : " + jqXHR.statusText);
			});
	}
	PhaseDataModel.prototype.UpdateRank = function() {
		var data = '{"rank":'+ this._rank +'}';
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, data).fail(function( jqXHR, textStatus ) {
				console.log("Error UpdateRank PhaseDataModel : " + jqXHR.statusText);
			});
	}
	PhaseDataModel.prototype.Delete = function() {
		return sendHttpRequest("DELETE", this._uriServices.DELETE + "/" + this._id, true, this).fail(function( jqXHR, textStatus ) {
				console.log("Error Delete PhaseDataModel : " + jqXHR.statusText);
			});
	}
	PhaseDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('name' in jsonObject) {
			this._name = jsonObject.name;
		}
		if ('startDate' in jsonObject) {
			this._startDate = jsonObject.startDate;
		}
		if ('endDate' in jsonObject) {
			this._endDate = jsonObject.endDate;
		}
		if ('rank' in jsonObject) {
			this._rank = jsonObject.rank;
		}
		if ('keeper' in jsonObject) {
			this._gateKeeper = jsonObject.keeper;
		}
		if ('workprocessId' in jsonObject) {
			if (this._workProcess == null) {
				this._workProcess = new WorkProcessDataModel();
			}
			this._workProcess.SetId(jsonObject.workprocessId);
			this._workProcess.Read();	
		}
	}
	PhaseDataModel.prototype.toJSON = function() {
		//stringify a phase object : used to send data to server
		var projectInformation = getProjectInformationBase64();
		var projectId = null;
		if(projectInformation != null) {
			if ('id' in projectInformation) {
				projectId = projectInformation.id;
			}			
		}
		return '{"id":'+this._id+', "name":"'+this._name+'", "startDate":"'+this._startDate+'", "endDate":"'+this._endDate+'", "rank":"'+this._rank+'", "gateKeeper":"'+this._uriServices.POST.USER+this._gateKeeper.id+'", "project":"'+this._uriServices.POST.PROJECT+projectId+'", "workprocess":"'+this._uriServices.POST.WP+this._workProcess.GetId()+'"}';
	}
	PhaseDataModel.prototype.toHTML = function() {				
	}
}());