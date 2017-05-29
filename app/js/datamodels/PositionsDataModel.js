var PositionsDataModel;
(function() {
    PositionsDataModel = function PositionsDataModel() {
      this._uriServices = {
        "GET" : WS_BASE_URL + "position/", // create web service
      };



      this._positionsDataSource = new kendo.data.DataSource({
        data: [],
        schema: {
          model: {
            id: "id"
          }
        }
      });

    };

	PositionsDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters

	PositionsDataModel.prototype.GetPositionsDataSource  = function() {
		return this._positionsDataSource;
	}

	// Setters



	PositionsDataModel.prototype.Read = function() {
		return sendHttpRequest("GET",this._uriServices.GET, true, this).done(function(result){
				if (typeof result == "object") {
					this.fromJSON(result);
				}
			}).fail(function( jqXHR, textStatus ) {
				console.log("Error Get PositionsDataModel : " + jqXHR.statusText);
			});
	}

	PositionsDataModel.prototype.fromJSON = function(jsonObject) {
    console.log(jsonObject);
    console.log(jsonObject._embedded.position);
		this._positionsDataSource.data(jsonObject._embedded.position);

	}
	PositionsDataModel.prototype.toJSON = function() {
		//stringify a workprocess object : used to send data to server
		return JSON.stringify(this._positionsDataSource.data().toJSON());
	}
	PositionsDataModel.prototype.toHTML = function() {
	}
}());
