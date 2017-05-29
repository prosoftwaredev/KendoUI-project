var DeliverableDataModelTest;
(function() {
  DeliverableDataModelTest = function DeliverableDataModelTest(phaseId, delirableId, userId, statusId) {
    this._uriServices = {
      "GET": WS_BASE_URL + "deliverable", // read web service /{id}
    };

    this._id = null;
    if ((typeof id != "undefined") && (id != null)) {
      this._id = id;
    }

    this._creationTime = null;
    if ((typeof creationTime != "undefined") && (creationTime != null)) {
      this._creationTime = creationTime;
    }

    this._lastUpdateTime = null;
    if ((typeof lastUpdateTime != "undefined") && (lastUpdateTime != null)) {
      this._lastUpdateTime = lastUpdateTime;
    }
  };

  DeliverableDataModelTest.prototype = Object.create(AbstractDataModel.prototype);
  // Getters
  DeliverableDataModelTest.prototype.GetId = function() {
    return this._id;
  }
  DeliverableDataModelTest.prototype.GetCreationTime= function() {
    return this._creationTime;
  }
  DeliverableDataModelTest.prototype.GetLastUpdateTime = function() {
    return this._lastUpdateTime;
  }

  DeliverableDataModelTest.prototype.GetDetailsAsObservable = function() {
    return kendo.observable({
      "creationTime" : this._creationTime,
      "lastUpdateTime" : this._lastUpdateTime,
      "lastUpdateTime": this._lastUpdateTime
    });
  }
  // Setters
  DeliverableDataModelTest.prototype.SetId = function(id) {
    this._id = id;
  }
  DeliverableDataModelTest.prototype.SetTitle = function(creationTime) {
    this._creationTime = creationTime;
  }
  DeliverableDataModel.prototype.SetIssueDate  = function(lastUpdateTime) {
    this._lastUpdateTime = lastUpdateTime;
  }
  // Operations
  DeliverableDataModelTest.prototype.Read = function() {
    return sendHttpRequest("GET", this._uriServices.GET + this._id + "/metadata", true, this).done(function(result){
      if (typeof result == "object") {
        this.fromJSON(result);
      }
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Get DeliverableDataModelTest : " + jqXHR.statusText);
    });
  }
  DeliverableDataModelTest.prototype.fromJSON = function(jsonObject) {
    if ('id' in jsonObject) {
      this._id = jsonObject.id;
    }
  }
  DeliverableDataModelTest.prototype.toJSON = function() {
    //stringify a workprocess object : used to send data to server
    return '{"id":'+this._id+', "creationTime":"'+this._creationTime+'", "lastUpdateTime":'+this._lastUpdateTime+'"}';
  }
  DeliverableDataModelTest.prototype.toHTML = function() {
  }

}());
