var UsersDataModel;
(function() {
    UsersDataModel = function UsersDataModel(organisationID,projectID) {
      this._uriServices = {
        "GET" :{
				"BYORG": WS_BASE_URL + "user/search/organisation/", 
				"BYPRJ": WS_BASE_URL + "user/search/project/"
				}
      };

      this._organisationID = null;
      if ((typeof organisationID != "undefined") && (organisationID != null)) {
        this._organisationID = organisationID;
      }
	  
	  this._projectID = null;
      if ((typeof projectID != "undefined") && (projectID != null)) {
        this._projectID = projectID;
      }

      this._usersDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });

    };

	UsersDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	UsersDataModel.prototype.GetOrganisationId = function() {
		return this._organisationID;
	}
	UsersDataModel.prototype.GetUsersDataSource  = function() {
		return this._usersDataSource;
	}

	// Setters
	UsersDataModel.prototype.SetOrganisationID = function(organisationID) {
		this._organisationID = organisationID;
	}
	UsersDataModel.prototype.SetProjectID = function(projectID) {
		this._projectID = projectID;
	}
	// Operations
	UsersDataModel.prototype.AddUser= function(user, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new User in local dataSource
			this._usersDataSource.pushCreate(JSON.parse(user.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new User in server
			return user.Create();
		}
	}
	UsersDataModel.prototype.UpdateUser = function(user, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update User in local dataSource
			if(this._usersDataSource.get(user.GetId()) != null) {
				this._usersDataSource.pushUpdate(JSON.parse(user.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update user in server
			return user.Update();
		}
	}
	UsersDataModel.prototype.DeleteUser = function(user, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove user from local dataSource
			if(this._usersDataSource.get(user.GetId()) != null) {
				this._usersDataSource.pushDestroy(JSON.parse(user.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove user from server
			return user.Delete();
		}
	}


	UsersDataModel.prototype.Read = function() {
	if (this._organisationID != null) {
		var url=this._uriServices.GET.BYORG+this._organisationID
	}else if(this._projectID != null){
		var url=this._uriServices.GET.BYPRJ+this._projectID;
	}
	
	
		return sendHttpRequest("GET",url, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get UsersDataModel : " + jqXHR.statusText);
			});
	}

	UsersDataModel.prototype.fromJSON = function(jsonObject) {
		this._usersDataSource.data(jsonObject);

	}
	UsersDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._usersDataSource.data().toJSON());
	}
	UsersDataModel.prototype.toHTML = function() {
	}
}());
