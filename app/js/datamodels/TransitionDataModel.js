var TransitionDataModel;
(function() {    
    TransitionDataModel = function TransitionDataModel(id, from, to, label, raci) {		
		this._uriServices = {
			"POST" : WS_BASE_URL + "transition", // create web service
			"PUT" : WS_BASE_URL + "transition", // update web service /{id}
			"GET" : WS_BASE_URL + "transition", // read web service /{id}
			"DELETE" : WS_BASE_URL + "transition", // delete web service /{id}
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
		this._label = null;
		if ((typeof label != "undefined") && (label != null)) {
			this._label = label;
		}
		this._raci = null; // {"R":true,"A":false,"C":true,"I":false}
		if ((typeof raci != "undefined") && (raci != null)) {
			this._raci = raci;
		}
		this._statuses = null;
	};
	
	TransitionDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	TransitionDataModel.prototype.GetId = function() {
		return this._id;
	}
	TransitionDataModel.prototype.GetFrom = function() {
		return this._from;
	}
	TransitionDataModel.prototype.GetTo = function() {
		return this._to;
	}
	TransitionDataModel.prototype.GetLabel = function() {
		return this._label;
	}
	TransitionDataModel.prototype.GetRACI = function() {
		return this._raci;
	}
	TransitionDataModel.prototype.GetDetailsAsObservable = function() {
		var fromText = null;
		var toText = null;
		var fromId = this._from;
		var toId = this._to;
		$.each(this._statuses, function(index, item){
			if (item.id == fromId){
				fromText = item.name;
			}
			if (item.id == toId){
				toText = item.name;
			}
		});
		return kendo.observable({
			"label" : this._label,
			"from":this._from,
			"fromText":fromText,
			"to" : this._to,
			"toText": toText,
			"R" : this._raci.R,
			"A" : this._raci.A,
			"C" : this._raci.C,
			"I" : this._raci.I,
			"status": this._statuses
		});
	}
	// Setters
	TransitionDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	TransitionDataModel.prototype.SetFrom = function(from) {
		this._from = from;
	}
	TransitionDataModel.prototype.SetTo = function(to) {
		this._to = to;
	}
	TransitionDataModel.prototype.SetLabel = function(label) {
		this._label = label;
	}
	TransitionDataModel.prototype.SetRACI = function(raci) {
		this._raci = raci;
	}
	TransitionDataModel.prototype.SetStatuses = function(statuses) {
		this._statuses = statuses;
	}
	// Operations
	TransitionDataModel.prototype.Create = function() {
		return sendHttpRequest("POST", this._uriServices.POST, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Create TransitionDataModel : " + jqXHR.statusText);
			});
	}
	TransitionDataModel.prototype.Read = function() {
		return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get TransitionDataModel : " + jqXHR.statusText);
			});
	}	
	TransitionDataModel.prototype.Update = function() {
		return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
				console.log("Error Update TransitionDataModel : " + jqXHR.statusText);
			});
	}
	TransitionDataModel.prototype.Delete = function() {
		return sendHttpRequest("DELETE", this._uriServices.DELETE + "/" + this._id, true, this).fail(function( jqXHR, textStatus ) {
				console.log("Error Delete TransitionDataModel : " + jqXHR.statusText);
			});
	}
	TransitionDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('from' in jsonObject) {
			this._from = jsonObject.from;
		}
		if ('to' in jsonObject) {
			this._to = jsonObject.to;
		}
		if('name' in jsonObject) {
			this._label = jsonObject.name;
		}
		if('raci' in jsonObject) {
			var rAccess = false;
			var aAccess = false;
			var cAccess = false;
			var iAccess = false;
			$.each(jsonObject.raci, function(index, value){
				if (value.name == "R") {
					rAccess = true;
				}
				if (value.name == "A") {
					aAccess = true;
				}
				if (value.name == "C") {
					cAccess = true;
				}
				if (value.name == "I") {
					iAccess = true;
				}
			});
			this._raci = {"R":rAccess,"A":aAccess,"C":cAccess,"I":iAccess};
		}
	}
	TransitionDataModel.prototype.toJSON = function() {
		//stringify a status object : used to send data to server
		return '{"id":'+this._id+', "from":'+this._from+', "to":'+this._to+', "name":"'+this._label+'", "raci":'+JSON.stringify(this._raci)+'}';
	}
	TransitionDataModel.prototype.toHTML = function() {				
	}
}());