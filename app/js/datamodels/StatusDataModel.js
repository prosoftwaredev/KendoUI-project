var StatusDataModel;
(function() {    
    StatusDataModel = function StatusDataModel(id, name, type, editable, commentable) {
		this._uriServices = {
			"POST" : WS_BASE_URL + "status", // create web service
			"PUT" : WS_BASE_URL + "status", // update web service /{id}
			"GET" : WS_BASE_URL + "status", // read web service /{id}
			"DELETE" : WS_BASE_URL + "status", // delete web service /{id}
		};	
		
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}
		this._name = null;
		if ((typeof name != "undefined") && (name != null)) {
			this._name= name;
		}
		this._type = null;
		if ((typeof type != "undefined") && (type != null)) {
			this._type = type;
		}
		this._editable = false;
		if ((typeof editable != "undefined") && (editable != null)) {
			this._editable = editable;
		}
		this._commentable = false;
		if ((typeof commentable != "undefined") && (commentable != null)) {
			this._commentable = commentable;
		}
	};
	
	StatusDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	StatusDataModel.prototype.GetId = function() {
		return this._id;
	}
	StatusDataModel.prototype.GetName = function() {
		return this._name;
	}
	StatusDataModel.prototype.GetType = function() {
		return this._type;
	}
	StatusDataModel.prototype.IsEditable = function() {
		return this._editable;
	}
	StatusDataModel.prototype.IsCommentable = function() {
		return this._commentable;
	}
	StatusDataModel.prototype.GetDetailsAsObservable = function() {
		return kendo.observable({
			"name" : this._name,
			"type": this._type,
			"commentable" : this._commentable,
			"editable" : this._editable
		});
	}
	// Setters
	StatusDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	StatusDataModel.prototype.SetName = function(name) {
		this._name = name;
	}
	StatusDataModel.prototype.SetType = function(type) {
		this._type = type;
	}
	StatusDataModel.prototype.SetEditable = function(editable) {
		this._editable = editable;
	}
	StatusDataModel.prototype.SetCommentable = function(commentable) {
		this._commentable = commentable;
	}
	// Operations
	StatusDataModel.prototype.Create = function() {
		return sendHttpRequest("POST", this._uriServices.POST, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Create StatusDataModel : " + jqXHR.statusText);
			});
	}
	StatusDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get StatusDataModel : " + jqXHR.statusText);
			});
	}	
	StatusDataModel.prototype.Update = function() {
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Update StatusDataModel : " + jqXHR.statusText);
			});
	}
	StatusDataModel.prototype.Delete = function() {
		return sendHttpRequest("DELETE", this._uriServices.DELETE + "/" + this._id, true, this).fail(function( jqXHR, textStatus ) {
				console.log("Error Delete StatusDataModel : " + jqXHR.statusText);
			});
	}
	StatusDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if('name' in jsonObject) {
			this._name = jsonObject.name;
		}
		if ('editable' in jsonObject) {
			this._editable = jsonObject.editable;
		}
		if('commentable' in jsonObject) {
			this._commentable = jsonObject.commentable;
		}		
		if ('type' in jsonObject) {
			this._type = jsonObject.type;
		}
	}
	StatusDataModel.prototype.toJSON = function() {
		//stringify a status object : used to send data to server
		return '{"id":'+this._id+', "name":"'+this._name+'", "editable":'+this._editable+', "commentable":'+this._commentable+', "type":'+JSON.stringify(this._type)+'}';
	}
	StatusDataModel.prototype.toHTML = function() {				
	}
}());