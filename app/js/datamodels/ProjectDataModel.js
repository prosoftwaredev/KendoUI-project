var ProjectDataModel;
(function() {    
    ProjectDataModel = function ProjectDataModel(id, name, active, centerName, location, goal, phase, sector, status, type, admin, organization) {		
		this._uriServices = {
			"POST" : {
				"PRJ":WS_BASE_URL + "project/",
				"SECTOR" : WS_BASE_URL + "projectsectorconfig/",
				"GOAL" : WS_BASE_URL + "projectgoalconfig/",
				"PHASE" : WS_BASE_URL + "projectphaseconfig/",
				"TYPE" : WS_BASE_URL + "projecttypeconfig/",
				"STATUS" : WS_BASE_URL + "projectstatusconfig/",
				"ORG" : WS_BASE_URL + "organisation/",
				"ASSIGN" : WS_BASE_URL + "assignment/",
				"USER": WS_BASE_URL + "user/",
				"POSITION" : WS_BASE_URL + "position/1"
				}, 
			"PUT" : WS_BASE_URL + "project", // update web service /{id}
			"GET" : WS_BASE_URL + "project/details",
			"DELETE" : WS_BASE_URL + "project" // delete web service /{id}
		};
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}
		this._name = null;
		if ((typeof name != "undefined") && (name != null)) {
			this._name = name;
		}
		this._active = null;
		if ((typeof active != "undefined") && (active != null)) {
			this._active = active;
		}
		this._centerName = null;
		if ((typeof centerName != "undefined") && (centerName != null)) {
			this._centerName = centerName;
		}
		this._location = null;
		if ((typeof location != "undefined") && (location != null)) {
			this._location = location;
		}
		this._goal = {id:null};
		if ((typeof goal != "undefined") && (goal != null)) {
			this._goal = goal;
		}
		this._phase = {id:null};
		if ((typeof phase != "undefined") && (phase != null)) {
			this._phase = phase;
		}
		this._sector = {id:null};
		if ((typeof sector != "undefined") && (sector != null)) {
			this._sector = sector;
		}
		this._status = {id:null};
		if ((typeof status != "undefined") && (status != null)) {
			this._status = status;
		}
		this._type = {id:null};
		if ((typeof type != "undefined") && (type != null)) {
			this._type = type;
		}
		this._admin = {id:null};
		if ((typeof admin != "undefined") && (admin != null)) {
			this._admin = admin;
		}
		this._organization = {id:null};
		if ((typeof organization != "undefined") && (organization != null)) {
			this._organization = organization;
		}		
	};
	ProjectDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	ProjectDataModel.prototype.GetId = function() {
		return this._id;
	}
	ProjectDataModel.prototype.GetName = function() {
		return this._name;
	}
	ProjectDataModel.prototype.GetActive = function() {
		return this._active;
	}	
	ProjectDataModel.prototype.GetDetailsAsObservable = function() {
		return kendo.observable({
			"name" : this._name,
			"active":this._active,
			"centerName" : this._centerName,
			"location" : this._location		
		});
	}
	// Setters
	ProjectDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	ProjectDataModel.prototype.SetName = function(name) {
		this._name = name;
	}
	ProjectDataModel.prototype.SetActive = function(active) {
		this._active = active;
	}
	ProjectDataModel.prototype.SetCenterName = function(centerName) {
		this._centerName = centerName;
	}
	ProjectDataModel.prototype.SetLocation = function(location) {
		this._location = location;
	}
	ProjectDataModel.prototype.SetAdmin = function(admin) {
		this._admin = admin;
	}
	ProjectDataModel.prototype.SetStatus = function(status) {
		this._status = status;
	}
	ProjectDataModel.prototype.SetType = function(type) {
		this._type = type;
	}
	ProjectDataModel.prototype.SetGoal = function(goal) {
		this._goal = goal;
	}
	ProjectDataModel.prototype.SetPhase = function(phase) {
		this._phase = phase;
	}
	ProjectDataModel.prototype.SetSector = function(sector) {
		this._sector = sector;
	}
	// Operations
	ProjectDataModel.prototype.Create = function() {
		return sendHttpRequest("POST", this._uriServices.POST.PRJ, true, this, this.toJSON()).done(function(result){
			if (typeof result == "object") {
				this.fromJSON(result);
			}
		}).fail(function( jqXHR, textStatus ) {
				console.log("Error Create ProjectDataModel : " + jqXHR.statusText);
			});
	}	
	ProjectDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get ProjectDataModel : " + jqXHR.statusText);
			});
	}
	ProjectDataModel.prototype.Update = function() {
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Update ProjectDataModel : " + jqXHR.statusText);
			});
	}
	ProjectDataModel.prototype.Delete = function() {
		return sendHttpRequest("DELETE", this._uriServices.DELETE + "/" + this._id, true, this).fail(function( jqXHR, textStatus ) {
				console.log("Error Delete ProjectDataModel : " + jqXHR.statusText);
			});
	}
	ProjectDataModel.prototype.Activate = function() {
		var data = '{"active":' + this._active + '}';
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, data).fail(function( jqXHR, textStatus ) {
				console.log("Error Activate ProjectDataModel : " + jqXHR.statusText);
			});
	}
	ProjectDataModel.prototype.Assign = function() {
		var data = '{"color":"green","project":"'+this._uriServices.POST.PRJ+this._id+'","position":"'+this._uriServices.POST.POSITION+'","user":"'+this._uriServices.POST.USER+this._admin.id+'"}';		
		return sendHttpRequest("POST", this._uriServices.POST.ASSIGN, true, this, data).fail(function( jqXHR, textStatus ) {
				console.log("Error Assign ProjectDataModel : " + jqXHR.statusText);
			});
	}
	ProjectDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('name' in jsonObject) {
			this._name = jsonObject.name;
		}
		if ('active' in jsonObject) {
			this._active = jsonObject.active;
		}
		if ('centerName' in jsonObject) {
			this._centerName = jsonObject.centerName;
		}
		if ('location' in jsonObject) {
			this._location = jsonObject.location;
		}
		if ('projectGoalConfig' in jsonObject) {
			this._goal = jsonObject.projectGoalConfig;
		}
		if ('projectPhaseConfig' in jsonObject) {
			this._phase = jsonObject.projectPhaseConfig;
		}
		if ('projectSectorConfig' in jsonObject) {
			this._sector = jsonObject.projectSectorConfig;
		}
		if ('projectStatusConfig' in jsonObject) {
			this._status = jsonObject.projectStatusConfig;		
		}
		if ('projectTypeConfig' in jsonObject) {
			this._type = jsonObject.projectTypeConfig;		
		}
		if ('projectAdmin' in jsonObject) {
			this._admin = jsonObject.projectAdmin;		
		}
		if ('organisation' in jsonObject) {
			this._organization = jsonObject.organisation;		
		}
	}
	ProjectDataModel.prototype.toJSON = function() {
		//stringify a project object : used to send data to server
		return '{"id":'+this._id+',"name":"'+this._name+'","active":'+this._active+',"centerName":"'+this._centerName+'","location":"'+this._location+'","projectGoalConfig":"'+this._uriServices.POST.GOAL+this._goal.id+'","projectPhaseConfig":"'+this._uriServices.POST.PHASE+this._phase.id+'","projectSectorConfig":"'+this._uriServices.POST.SECTOR+this._sector.id+'","projectStatusConfig":"'+this._uriServices.POST.STATUS+this._status.id+'","projectTypeConfig":"'+this._uriServices.POST.TYPE+this._type.id+'","projectAdmin":"'+this._uriServices.POST.USER+this._admin.id+'","organisation":"'+this._uriServices.POST.ORG+this._organization.id+'"}';
	}
	ProjectDataModel.prototype.toHTML = function() {				
	}
}());