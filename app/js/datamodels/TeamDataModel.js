var TeamDataModel;
(function() {
    TeamDataModel = function TeamDataModel(projectID) {
      this._uriServices = {
        "GET" : WS_BASE_URL + "assignment/search/orgChart/", // create web service
        "POST": WS_BASE_URL + "assignment/orgChart/"
      };

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

	this._hierarchysDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });
    };

	TeamDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	TeamDataModel.prototype.GetProjectId = function() {
		return this._projectID;
	}
	TeamDataModel.prototype.GetUsersDataSource  = function() {
		return this._usersDataSource;
	}
	TeamDataModel.prototype.GetHierarchysDataSource = function() {
		return this._hierarchysDataSource;
	}
	// Setters
	TeamDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	// Operations
	TeamDataModel.prototype.AddUser= function(user, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {

			// save new User in local dataSource
      if(this._usersDataSource.get(user.GetId()) != null) {
        return false;
      }
      else{
        this._usersDataSource.pushCreate(JSON.parse(user.toJSON()));
        return true;
      }
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new User in server
			return user.Create();
		}
	}
	TeamDataModel.prototype.UpdateUser = function(user, mode) {
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
	TeamDataModel.prototype.DeleteUser = function(user, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove user from local dataSource
			if(this._usersDataSource.get(user.GetId()) != null) {

				this._usersDataSource.remove(this._usersDataSource.get(user.GetId()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove user from server
			return user.Delete();
		}
	}

	TeamDataModel.prototype.AddHierarchy= function(hierarchy, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new hierarchy in local dataSource
			this._hierarchysDataSource.pushCreate(JSON.parse(hierarchy.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new hierarchy in server
			return hierarchy.Create();
		}
	}
	TeamDataModel.prototype.UpdateHierarchy = function(hierarchy, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update hierarchy in local dataSource
			if(this._hierarchysDataSource.get(hierarchy.GetId()) != null) {
				this._hierarchysDataSource.pushUpdate(JSON.parse(hierarchy.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update hierarchy in server
			return hierarchy.Update();
		}
	}
	TeamDataModel.prototype.DeleteHierarchy = function(hierarchy, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove hierarchy from local dataSource
			if(this._hierarchysDataSource.get(hierarchy.GetId()) != null) {
				this._hierarchysDataSource.pushDestroy(JSON.parse(hierarchy.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove hierarchy from server
			return hierarchy.Delete();
		}
	}

	TeamDataModel.prototype.Read = function() {
    var url=this._uriServices.GET+this._projectID
		return sendHttpRequest("GET",url, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get TeamDataModel : " + jqXHR.statusText);
			});
	}
  TeamDataModel.prototype.Create = function() {
    var url=this._uriServices.POST;
    return sendHttpRequest("POST",url, true,this,this.toJSON()).done(function(result){

    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Post TeamDataModel : " + jqXHR.statusText);
    });
  }

	TeamDataModel.prototype.fromJSON = function(jsonObject) {
		this._usersDataSource.data(jsonObject.orgChartUsers);
		this._hierarchysDataSource.data(jsonObject.orgChartHierarchies);
	}
	TeamDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
    var usersToPost=JSON.stringify(this._usersDataSource.data().toJSON());
    var hierarchysToPost=JSON.stringify(this._hierarchysDataSource.data().toJSON());

return '{"id":'+this._projectID+', "orgChartUsers":'+usersToPost+', "orgChartHierarchies":'+hierarchysToPost+'}';

  }
	TeamDataModel.prototype.toHTML = function() {
	}
}());
