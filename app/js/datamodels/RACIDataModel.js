var RACIDataModel;
(function() {
    RACIDataModel = function RACIDataModel(projectID,phaseID,deliverableID) {
      this._uriServices = {
		"GET" : {
				"ALL" : WS_BASE_URL + "deliverable/project/",
				"BYDELPHASE" : WS_BASE_URL + "deliverable/raciroles?phaseId="
		},
		"POST":WS_BASE_URL + "deliverable/raciroles",
      };

      this._projectID = null;
      if ((typeof projectID != "undefined") && (projectID != null)) {
        this._projectID = projectID;
      }
      this._phaseID = null;
      if ((typeof phaseID != "undefined") && (phaseID != null)) {
        this._phaseID = phaseID;
      }
      this._deliverableID = null;
      if ((typeof deliverableID != "undefined") && (deliverableID != null)) {
        this._deliverableID = deliverableID;
      }
	    this._PreviewDataSource = new kendo.data.DataSource({
        data: []
      });
      this._ColumnsPreviewDataSource = new kendo.data.DataSource({
        data: []
      });
      this._RDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });

	this._ADataSource = new kendo.data.DataSource({
        data: [],
    schema: {
      model: {
        id: "id"
      }
    }

      });

  this._CDataSource = new kendo.data.DataSource({
    data: [],
    schema: {
      model: {
        id: "id"
      }
    }

  });

  this._IDataSource = new kendo.data.DataSource({
    data: [],
    schema: {
      model: {
        id: "id"
      }
    }

  });

};
	RACIDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	RACIDataModel.prototype.GetPhaseID = function() {
		return this._phaseID;
	}
  RACIDataModel.prototype.GetDeliverableID = function() {
    return this._deliverableID;
  }
    RACIDataModel.prototype.GetProjectID= function() {
    return this._projectID;
  }
  RACIDataModel.prototype.GetPreviewDataSource = function() {
		return this._PreviewDataSource;
	}
  RACIDataModel.prototype.GetColumnsPreviewDataSource = function() {
    return this._ColumnsPreviewDataSource;
  }

	RACIDataModel.prototype.GetRDataSource  = function() {
		return this._RDataSource;
	}
	RACIDataModel.prototype.GetADataSource = function() {
		return this._ADataSource;
	}

  RACIDataModel.prototype.GetCDataSource = function() {
    return this._CDataSource;
  }
  RACIDataModel.prototype.GetIDataSource = function() {
    return this._IDataSource;
  }
	// Setters
	RACIDataModel.prototype.SetPhaseID = function(phaseID) {
		this._phaseID = phaseID;
	}
  RACIDataModel.prototype.SetDeliverableID = function(deliverableID) {
    this._deliverableID = deliverableID;
  }
    RACIDataModel.prototype.SetProjectID = function(projectID) {
    this._projectID = projectID;
  }

	// Operations
	RACIDataModel.prototype.AddUserToR= function(user, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new User in local dataSource
			this._RDataSource.pushCreate(JSON.parse(user.toJSON()));
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new User in server
			return user.Create();
		}
	}
  RACIDataModel.prototype.AddUserToA= function(user, mode) {
    if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
      // save new User in local dataSource
      this._ADataSource.pushCreate(JSON.parse(user.toJSON()));
    }
    if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
      // save new User in server
      return user.Create();
    }
  }
  RACIDataModel.prototype.AddUserToC= function(user, mode) {
    if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
      // save new User in local dataSource
      this._CDataSource.pushCreate(JSON.parse(user.toJSON()));
    }
    if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
      // save new User in server
      return user.Create();
    }
  }
  RACIDataModel.prototype.AddUserToI= function(user, mode) {
    if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
      // save new User in local dataSource
      this._IDataSource.pushCreate(JSON.parse(user.toJSON()));
    }
    if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
      // save new User in server
      return user.Create();
    }
  }

	RACIDataModel.prototype.DeleteUserFromR = function(user, mode){
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// remove user from local dataSource
			if(this._RDataSource.get(user.GetId()) != null) {
				this._RDataSource.pushDestroy(JSON.parse(user.toJSON()));
			}
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// remove user from server
			return user.Delete();
		}
	}
  RACIDataModel.prototype.DeleteUserFromA = function(user, mode){
    if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
      // remove user from local dataSource
      if(this._ADataSource.get(user.GetId()) != null) {
        this._ADataSource.pushDestroy(JSON.parse(user.toJSON()));
      }
    }
    if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
      // remove user from server
      return user.Delete();
    }
  }
  RACIDataModel.prototype.DeleteUserFromC = function(user, mode){
    if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
      // remove user from local dataSource
      if(this._CDataSource.get(user.GetId()) != null) {
        this._CDataSource.pushDestroy(JSON.parse(user.toJSON()));
      }
    }
    if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
      // remove user from server
      return user.Delete();
    }
  }
  RACIDataModel.prototype.DeleteUserFromI = function(user, mode){
    if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
      // remove user from local dataSource
      if(this._IDataSource.get(user.GetId()) != null) {
        this._IDataSource.pushDestroy(JSON.parse(user.toJSON()));
      }
    }
    if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
      // remove user from server
      return user.Delete();
    }
  }


	RACIDataModel.prototype.Read = function() {
	    if ((this._phaseID != null)&&(this._deliverableID != null)) {
			var url = this._uriServices.GET.BYDELPHASE+this._phaseID+"&deliverableId="+this._deliverableID;
					return sendHttpRequest("GET",url, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get RACIDataModel : " + jqXHR.statusText);
			});
		}else if(this._projectID != null)
		{
		   var url = this._uriServices.GET.ALL + this._projectID + "/raciroles";
		   		return sendHttpRequest("GET",url, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSONALL(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get RACIDataModel : " + jqXHR.statusText);
			});
		}

	}
  RACIDataModel.prototype.Create = function() {
    var url=this._uriServices.POST;
    return sendHttpRequest("POST",url, true,this,this.toJSON()).done(function(result){

    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Post RACIDataModel : " + jqXHR.statusText);
    });
  }

	RACIDataModel.prototype.fromJSON = function(jsonObject) {
    var that=this;
    $.each(jsonObject, function(i, obj) {

      if(obj.raciRole.name=="R") {
        that._RDataSource.data(obj.users);
      }
      if(obj.raciRole.name=="A") {
        that._ADataSource.data(obj.users);
      }
      if(obj.raciRole.name=="C") {
        that._CDataSource.data(obj.users);
      }
      if(obj.raciRole.name=="I") {
        that._IDataSource.data(obj.users);
      }
    });

	}

	RACIDataModel.prototype.fromJSONALL = function(jsonObject) {
    console.log(jsonObject);
	if((typeof jsonObject != "undefined") && (jsonObject != null)){
   if((jsonObject.raciRoleDeliverable.length>0)&&(jsonObject.users.length>0)) {
     var result = "[";
     $.each(jsonObject.raciRoleDeliverable, function (i, obj) {
       result = result + '{"Phase":"' + obj.phaseName + '", "Deliverable":"' + obj.deliverableName + '",'
       for (j = 0; j < obj.raciRoles.length; j++) {
         if (j != obj.raciRoles.length - 1)
           result = result + '"' + jsonObject.users[j].username + '":"' + obj.raciRoles[j] + '",';
         else
           result = result + '"' + jsonObject.users[j].username + '":"' + obj.raciRoles[j] + '"';

       }
       if (i != jsonObject.raciRoleDeliverable.length - 1)
         result = result + '},';
       else
         result = result + '}';
     });
     result = result + "]";

     this._PreviewDataSource.data(JSON.parse(result));
     result = '[{"field":"Phase","title":"Phase"},{"field":"Deliverable","title":"Deliverable"},';
     $.each(jsonObject.users, function (i, obj) {
       if (i != jsonObject.users.length - 1)
         result = result + '{"field":"' + obj.username + '","title":"' + obj.name + ' ' + obj.firstname + '"},';
       else
         result = result + '{"field":"' + obj.username + '","title":"' + obj.name + ' ' + obj.firstname + '"}';
     });
     result = result + "]";
   }else{result="[{}]";}
	}else{
	result="[{}]";
	}
    this._ColumnsPreviewDataSource.data(JSON.parse(result));
  }
	RACIDataModel.prototype.toJSON = function() {
		var RToPost=JSON.stringify(this._RDataSource.data().toJSON());
		var AToPost=JSON.stringify(this._ADataSource.data().toJSON());
		var CToPost=JSON.stringify(this._CDataSource.data().toJSON());
		var IToPost=JSON.stringify(this._IDataSource.data().toJSON());

		return '{"phaseId":'+this._phaseID+', "id":'+this._deliverableID+',"raciRoleUsers":[{"raciRole":{"id":1},"users":'+RToPost+'}, {"raciRole":{"id":2},"users":'+AToPost+'},{"raciRole":{"id":3},"users":'+CToPost+'},{"raciRole":{"id":4},"users":'+IToPost+'}]}';
	}
	RACIDataModel.prototype.toHTML = function() {
	}
}());
