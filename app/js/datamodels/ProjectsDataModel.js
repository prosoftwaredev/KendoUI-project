var ProjectsDataModel;
(function() {    
    ProjectsDataModel = function ProjectsDataModel(userId, organizationId, userRegularRole) {		
		this._uriServices = {
			"GET" : {
				"ALL": WS_BASE_URL + "project", // get web service
				"BYUSER" : WS_BASE_URL + "project/search/user/",
				"BYORG" : WS_BASE_URL + "project/search/organisation/"
			}
		}; 
		
		this._userId = null;
		if ((typeof userId != "undefined") && (userId != null)) {
			this._userId = userId;
		}
		
		this._organizationId = null;
		if ((typeof organizationId != "undefined") && (organizationId != null)) {
			this._organizationId = organizationId;
		}
		
		this._userRegularRole = null;
		if ((typeof userRegularRole != "undefined") && (userRegularRole	 != null)) {
			this._userRegularRole = userRegularRole;
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
	};
	
	ProjectsDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	ProjectsDataModel.prototype.GetUserId = function() {
		return this._userId;
	}
	ProjectsDataModel.prototype.GetOrganizationId = function() {
		return this._organizationId;
	}
	ProjectsDataModel.prototype.GetDataSource = function() {
		return this._dataSource;
	}
	ProjectsDataModel.prototype.GetProjectsAsObservable = function() {
		return kendo.observable({"projects" : this._dataSource.view().toJSON()});
	}
	// Setters
	ProjectsDataModel.prototype.SetUserId = function(id) {
		this._userIdid = id;
	}
	ProjectsDataModel.prototype.SetOrganizationId = function(id) {
		this._organizationId = id;
	}
	ProjectsDataModel.prototype.GetProjectById = function(id) {
		return this._dataSource.get(id).toJSON();		
	}
	
	// Operations
	ProjectsDataModel.prototype.IsProjectExist = function(name) {
		var exist = false;
		$.each(this._dataSource.data().toJSON(), function(index, value){
			if (value.name == name) {
				exist = true;
			}
		});
		
		return exist;
	}
	ProjectsDataModel.prototype.AddProject = function(project, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new project in local dataSource
			this._dataSource.pushCreate(JSON.parse(project.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new project in server
			return project.Create();
		}
	}
	ProjectsDataModel.prototype.UpdateProject = function(project, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update project in local dataSource
			if(this._dataSource.get(project.GetId()) != null) {
				this._dataSource.pushUpdate(JSON.parse(project.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update project in server
			return project.Update();
		}
	}
	ProjectsDataModel.prototype.DeleteProject = function(project, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove project from local dataSource
			if(this._dataSource.get(project.GetId()) != null) {
				this._dataSource.pushDestroy(JSON.parse(project.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove project from server
			return project.Delete();
		}
	}
	
	ProjectsDataModel.prototype.ActivateProject = function(project, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove project from local dataSource
			if(this._dataSource.get(project.GetId()) != null) {
				var dataItem = this._dataSource.get(project.GetId());
				dataItem.active = project.GetActive();
				this._dataSource.pushUpdate(dataItem);
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove project from server
			return project.Activate();
		}
	}
	
	ProjectsDataModel.prototype.Read = function() {
		var url = this._uriServices.GET.ALL;
		if (this._organizationId != null) {
			url = this._uriServices.GET.BYORG + this._organizationId;
		}
		if (this._userId != null) {
			url = this._uriServices.GET.BYUSER + this._userId;
		}
		return sendHttpRequest("GET", url, true, this).done(function(result){
			if (typeof result == "object") {
				if('projects' in result) {
					this.fromJSON(result.projects);
				} else {
					if (('_embedded' in result) && ('project' in result._embedded)) {
						this.fromJSON(result._embedded.project);
					}
				}
			}
		}).fail(function( jqXHR, textStatus ) {
			console.log("Error Get ProjectsDataModel : " + jqXHR.statusText);
		});
	}
	
	ProjectsDataModel.prototype.fromJSON = function(jsonObject) {
		var projects = [];
		var regularRole = this._userRegularRole;
		$.each(jsonObject, function(index, value) {
			var project = null;
			if ('project' in value) {
				var canEditProject = (value.role == "PROJECT_ADMIN_ROLE") || (regularRole == "PROGRAM_ROLE");
				var canDeleteProject = (regularRole == "PROGRAM_ROLE");
				project = {"id": value.project.id,"name": value.project.name,"active": value.project.active, "canEditProject":canEditProject, "canDeleteProject":canDeleteProject};
			} else {
				var canEditProject = (regularRole == "PROGRAM_ROLE");
				var canDeleteProject = (regularRole == "PROGRAM_ROLE");
				project = {"id": value.id,"name": value.name,"active": value.active, "canEditProject":canEditProject, "canDeleteProject":canDeleteProject};
			}
			if (project != null) {
				projects.push(project);
			}
		});
		this._dataSource.data(projects);
	}
	ProjectsDataModel.prototype.toJSON = function() {
		//stringify a Projects object : used to send data to server
		return JSON.stringify(this._dataSource.data().toJSON());
	}
	ProjectsDataModel.prototype.toHTML = function() {				
	}
}());