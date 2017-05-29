var StatusTypeDataModel;
var _statusTypesDataSource = null;
(function() {    
    StatusTypeDataModel = function StatusTypeDataModel(id, label) {
		this._id = null;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}
		this._label = null;
		if ((typeof label != "undefined") && (label != null)) {
			this._label= label;
		}
	};
	StatusTypeDataModel._uriServices = {
		"GET" : "http://demo1913794.mockable.io/status/types" //"/rest/api/status/types", // read web service
	};	
	StatusTypeDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	StatusTypeDataModel.prototype.GetId = function() {
		return this._id;
	}
	StatusTypeDataModel.prototype.GetLabel = function() {
		return this._label;
	}
	// Setters
	StatusTypeDataModel.prototype.SetId = function(id) {
		this._id = id;
	}
	StatusTypeDataModel.prototype.SetLabel = function(label) {
		this._label = label;
	}
	// static functions
	StatusTypeDataModel.Read = function() {
		return sendHttpRequest("GET", StatusTypeDataModel._uriServices.GET, true).done(function(result){
				if (typeof result == "object") {
					_statusTypesDataSource.data(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Read StatusTypeDataModel : " + jqXHR.statusText);
			});
	}
	StatusTypeDataModel.GetStatusTypesDataSource = function() {
		if (_statusTypesDataSource == null) {
			_statusTypesDataSource = new kendo.data.DataSource({
				data: [],
				schema: {
					model: {
						id: "id",
						fields: {
							id: { from: "id", type: "number", editable: false }
							// other fields
						}
					}
				}
			});
			StatusTypeDataModel.Read();
		}
		return _statusTypesDataSource;
	}
	
	// Operations
	StatusTypeDataModel.prototype.fromJSON = function(jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if('label' in jsonObject) {
			this._label = jsonObject.label;
		}		
	}
	StatusTypeDataModel.prototype.toJSON = function() {
		//stringify a status object : used to send data to server
		return '{"id":'+this._id+', "label":"'+this._label+'"}';
	}
	StatusTypeDataModel.prototype.toHTML = function() {				
	}
}());