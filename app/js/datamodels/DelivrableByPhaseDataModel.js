
var DelivrableByPhaseDataModel;
DelivrableByPhaseDataModel = Object.create(AbstractDataModel.prototype);
(function() {    

    DelivrableByPhaseDataModel = function DelivrableByPhaseDataModel() {
		AbstractDataModel.apply(this, arguments);
		this._uriServices = {
			"POST" : "", // create web service
			"PUT" : "", // update web service
			"GET" : "", // read web service
			"DELETE" : "", // delete web service
		};
		
	this._dataSource = new kendo.data.DataSource({
			data: [],
			
	});
	};
	DelivrableByPhaseDataModel.prototype.Create = function(arguments, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// save new phase in local dataSource
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// save new phase in server
		}
	}	
	DelivrableByPhaseDataModel.prototype.Read = function() {
		// Update dataSource with retrieved data from server
		var tmpData;
		$.ajax({
			type:'Get',
			url:'http://demo6413955.mockable.io/listOfDelivrableByPhase',
			success:function(data) {
			 tmpData=data;
			},
			async: false
		});
		this._dataSource.data(tmpData);
	}
	
	DelivrableByPhaseDataModel.prototype.GetDataSource = function() {
		// Update dataSource with retrieved data from server
		return this._dataSource;	
	}
	DelivrableByPhaseDataModel.prototype.Update = function(arguments, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// update phase in local dataSource
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// update phase in server
		}
	}
	DelivrableByPhaseDataModel.prototype.Delete = function(arguments, mode) {
		if ((mode == Mode.LOCAL) || (mode == Mode.ALL)) {
			// delete phase from local dataSource
		}
		if ((mode == Mode.REMOTE) || (mode == Mode.ALL)) {
			// delete phase from server
		}
	}
	DelivrableByPhaseDataModel.prototype.toJSON = function() {
		//stringify a phase object : used to send data to server
	}
	DelivrableByPhaseDataModel.prototype.toHTML = function() {				
	}
}());