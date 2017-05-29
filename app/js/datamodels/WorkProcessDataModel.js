var WorkProcessDataModel;
(function() {    
    WorkProcessDataModel = function WorkProcessDataModel(id, name) {		
		this._uriServices = {
			"POST" : WS_BASE_URL + "workprocess/workprocesschart", // create web service
			"PUT" : WS_BASE_URL + "workprocess/workprocesschart/", // update web service /{id}
			"GET" : WS_BASE_URL + "workprocess/search/workprocesschart/", // read web service /{id}
			"DELETE" : WS_BASE_URL + "workprocess/", // delete web service /{id}
		};
		
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}
		this._name = null;
		if ((typeof name != "undefined") && (name != null)) {
			this._name = name;
		}
		this._used = false;
		
		this._statusDataSource = new kendo.data.DataSource({
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
		this._transitionsDataSource = new kendo.data.DataSource({
			data: [],
			schema: {
				model: {
					id: "id",
					fields: {
						id:{ from: "id", type: "number", editable: false },
						from:{from:"from", type:"number"},
						to:{from:"to",type:"number"}
						// other fields
					}
				}
			}
		});
	};
	
	WorkProcessDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	WorkProcessDataModel.prototype.GetId = function() {
		return this._id;
	}
	WorkProcessDataModel.prototype.GetName = function() {
		return this._name;
	}
	WorkProcessDataModel.prototype.GetStatusDataSource = function() {
		return this._statusDataSource;
	}
	WorkProcessDataModel.prototype.GetTransitionsDataSource = function() {
		return this._transitionsDataSource;
	}
	WorkProcessDataModel.prototype.GetDetailsAsObservable = function() {
		return kendo.observable({
			"name" : this._name,
			"used" : this._used
		});
	}
	// Setters
	WorkProcessDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	WorkProcessDataModel.prototype.SetName = function(name) {
		this._name = name;
	}
	// Operations
	WorkProcessDataModel.prototype.IsSatusExist = function(name) {
		var exist = false;
		$.each(this._statusDataSource.data().toJSON(), function(index, value){
			if (value.name == name) {
				exist = true;
			}
		});
		
		return exist;
	}
	WorkProcessDataModel.prototype.IsTransitionExist = function(name) {
		var exist = false;
		$.each(this._transitionDataSource.data().toJSON(), function(index, value){
			if (value.name == name) {
				exist = true;
			}
		});
		
		return exist;
	}
	WorkProcessDataModel.prototype.AddStatus = function(status, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new status in local dataSource
			this._statusDataSource.pushCreate(JSON.parse(status.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new status in server
			return status.Create();
		}
	}
	WorkProcessDataModel.prototype.UpdateStatus = function(status, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update status in local dataSource
			if(this._statusDataSource.get(status.GetId()) != null) {
				this._statusDataSource.pushUpdate(JSON.parse(status.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update status in server
			return status.Update();
		}
	}
	WorkProcessDataModel.prototype.DeleteStatus = function(status, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove status from local dataSource
			if(this._statusDataSource.get(status.GetId()) != null) {
				this._statusDataSource.pushDestroy(JSON.parse(status.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove status from server
			return status.Delete();
		}
	}
	WorkProcessDataModel.prototype.AddTransition = function(transition, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new transition in local dataSource
			this._transitionsDataSource.pushCreate(JSON.parse(transition.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new transition in server
			return transition.Create();
		}
	}
	WorkProcessDataModel.prototype.UpdateTransition = function(transition, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update transition in local dataSource
			if(this._transitionsDataSource.get(transition.GetId()) != null) {
				this._transitionsDataSource.pushUpdate(JSON.parse(transition.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update transition in server
			return transition.Update();
		}
	}
	WorkProcessDataModel.prototype.DeleteTransition = function(transition, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove transition from local dataSource
			if(this._transitionsDataSource.get(transition.GetId()) != null) {
				this._transitionsDataSource.pushDestroy(JSON.parse(transition.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove transition from server
			return transition.Delete();
		}
	}
	
	WorkProcessDataModel.prototype.Create = function() {
		return sendHttpRequest("POST", this._uriServices.POST, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Create WorkProcessDataModel : " + jqXHR.statusText);
			});
	}	
	WorkProcessDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET + this._id, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get WorkProcessDataModel : " + jqXHR.statusText);
			});
	}
	WorkProcessDataModel.prototype.Update = function() {
		return sendHttpRequest("PUT", this._uriServices.PUT + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Update WorkProcessDataModel : " + jqXHR.statusText);
			});
	}
	WorkProcessDataModel.prototype.Delete = function() {
		return sendHttpRequest("DELETE", this._uriServices.DELETE + this._id, true, this).fail(function( jqXHR, textStatus ) {
				console.log("Error Delete WorkProcessDataModel : " + jqXHR.statusText);
			});
	}
	WorkProcessDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('name' in jsonObject) {
			this._name = jsonObject.name;
		}
		if ('statusChart' in jsonObject) {
			this._statusDataSource.data(jsonObject.statusChart);
		}
		if('transitionsChart' in jsonObject) {
			this._transitionsDataSource.data(jsonObject.transitionsChart);
		}
	}
	WorkProcessDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		var organizationId = null;
		var currentUserInformation = getUserInformationBase64();
		if (currentUserInformation != null) {
			if ('organizationId' in currentUserInformation) {
				organizationId = currentUserInformation.organizationId;
			}
		}
		return '{"id":'+this._id+', "name":"'+this._name+'", "organisationId":'+organizationId+', "statusChart":'+JSON.stringify(this._statusDataSource.data().toJSON())+', "transitionsChart":'+JSON.stringify(this._transitionsDataSource.data().toJSON())+'}';
	}
	WorkProcessDataModel.prototype.toHTML = function() {
	}
}());