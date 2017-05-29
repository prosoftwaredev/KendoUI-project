var HierarchyDataModel;
(function() {    
    HierarchyDataModel = function HierarchyDataModel(id, from, to) {		
		this._uriServices = {
			"POST" : "/rest/api/transitions", // create web service
			"PUT" : "/rest/api/transitions", // update web service /{id}
			"GET" : "/rest/api/transitions", // read web service /{id}
			"DELETE" : "/rest/api/transitions", // delete web service /{id}
		};
		
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}		
		this._from = null;
		if ((typeof from != "undefined") && (from != null)) {
			this._from = from;
		}
		this._to = null;
		if ((typeof to != "undefined") && (to != null)) {
			this._to = to;
		}
		
	};
	
	HierarchyDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	HierarchyDataModel.prototype.GetId = function() {
		return this._id;
	}
	HierarchyDataModel.prototype.GetFrom = function() {
		return this._from;
	}
	HierarchyDataModel.prototype.GetTo = function() {
		return this._to;
	}
	
	
	// Setters
	HierarchyDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	HierarchyDataModel.prototype.SetFrom = function(from) {
		this._from = from;
	}
	HierarchyDataModel.prototype.SetTo = function(to) {
		this._to = to;
	}
	
	// Operations
	HierarchyDataModel.prototype.Create = function() {
		return sendHttpRequest("POST", this._uriServices.POST, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Create HierarchyDataModel : " + jqXHR.statusText);
			});
	}
	HierarchyDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get HierarchyDataModel : " + jqXHR.statusText);
			});
	}	
	HierarchyDataModel.prototype.Update = function() {
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Update HierarchyDataModel : " + jqXHR.statusText);
			});
	}
	HierarchyDataModel.prototype.Delete = function() {
		return sendHttpRequest("DELETE", this._uriServices.DELETE + "/" + this._id, true, this).fail(function( jqXHR, textStatus ) {
				console.log("Error Delete HierarchyDataModel : " + jqXHR.statusText);
			});
	}
	HierarchyDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('from' in jsonObject) {
			this._from = jsonObject.from;
		}
		if ('to' in jsonObject) {
			this._to = jsonObject.to;
		}
		
	}
	HierarchyDataModel.prototype.toJSON = function() {
		//stringify a status object : used to send data to server
		return '{"id":'+this._id+', "from":'+this._from+', "to":'+this._to+'}';
	}
	HierarchyDataModel.prototype.toHTML = function() {				
	}
}());