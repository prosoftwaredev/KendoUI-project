var UserDataModel;
(function() {
  UserDataModel = function UserDataModel(id, name,firstName, type,positionID, position,color,avatar) {
    this._uriServices = {
      "POST" : WS_BASE_URL + "user", // create web service
      "PUT" : WS_BASE_URL + "user", // update web service /{id}
      "GET" : WS_BASE_URL + "user", // read web service /{id}
      "DELETE" : WS_BASE_URL + "user", // delete web service /{id}
    };
    this._id = null;
    if ((typeof id != "undefined") && (id != null)) {
      this._id = id;
    }
    this._name = null;
    if ((typeof name != "undefined") && (name != null)) {
      this._name = name;
    }
    this._firstName = null;
    if ((typeof firstName != "undefined") && (firstName != null)) {
      this._firstName = firstName;
    }
    this._type = null;
    if ((typeof type != "undefined") && (type != null)) {
      this._type = type;
    }
    this._position = null;
    if ((typeof position != "undefined") && (position != null)) {
      this._position = position;
    }
    this._positionID = null;
    if ((typeof positionID != "undefined") && (positionID != null)) {
      this._positionID = positionID;
    }
    this._color = null;
    if ((typeof color != "undefined") && (color != null)) {
      this._color = color;
    }
    this._avatar = null;
    if ((typeof avatar != "undefined") && (avatar != null)) {
      this._avatar = avatar;
    }

  };
  UserDataModel.prototype = Object.create(AbstractDataModel.prototype);
  // Getters
  UserDataModel.prototype.GetId = function() {
    return this._id;
  }
  UserDataModel.prototype.GetName = function() {
    return this._name;
  }
  UserDataModel.prototype.GetFirstName = function() {
    return this._firstName;
  }
  UserDataModel.prototype.GetType = function() {
    return this._type;
  }

  UserDataModel.prototype.GetPosition = function() {
    return this._position;
  }
  UserDataModel.prototype.GetPositionID = function() {
    return this._positionID;
  }
  UserDataModel.prototype.GetColor = function() {
    return this._color;
  }
  UserDataModel.prototype.GetAvatar = function() {
    return this._avatar;
  }
  UserDataModel.prototype.GetDetailsAsObservable = function() {
    return kendo.observable({
      "name" : this._name,
      "firstName" : this._firstName,
      "type":this._type,
      "position" : this._position,
      "color" : this._color,
      "avatar" : this._avatar,

    });
  }
  // Setters
  UserDataModel.prototype.SetId = function(id) {
    this._id = id;
  }
  UserDataModel.prototype.SetName = function(name) {
    this._name = name;
  }
  UserDataModel.prototype.SetFirstName = function(firstName) {
    this._firstName = firstName;
  }
  UserDataModel.prototype.SetType = function(type) {
    this._type = type;
  }
  UserDataModel.prototype.SetPosition = function(position) {
    this._position = position;
  }
  UserDataModel.prototype.SetPositionID = function(positionID) {
    this._positionID = positionID;
  }
  UserDataModel.prototype.SetColor = function(color) {
    this._color = color;
  }
  UserDataModel.prototype.SetAvatar = function(avatar) {
    this._avatar = avatar;
  }


  // Operations
  UserDataModel.prototype.Create = function() {
    return sendHttpRequest("POST", this._uriServices.POST, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
      console.log("Error Create UserDataModel : " + jqXHR.statusText);
    });
  }
  UserDataModel.prototype.Read = function() {
    return sendHttpRequest("GET", this._uriServices.GET + "/" + this._id, true, this).done(function(result){
      if (typeof result == "object") {
        this.fromJSON(result);
      }
    }).fail(function( jqXHR, textStatus ) {
      console.log("Error Get UserDataModel : " + jqXHR.statusText);
    });
  }
  UserDataModel.prototype.Update = function() {
    return sendHttpRequest("PATCH", this._uriServices.PUT + "/" + this._id, true, this, this.toJSON()).fail(function( jqXHR, textStatus ) {
      console.log("Error Update UserDataModel : " + jqXHR.statusText);
    });
  }
  UserDataModel.prototype.Delete = function() {
    return sendHttpRequest("DELETE", this._uriServices.DELETE + "/" + this._id, true, this).fail(function( jqXHR, textStatus ) {
      console.log("Error Delete UserDataModel : " + jqXHR.statusText);
    });
  }
  UserDataModel.prototype.fromJSON = function(jsonObject) {

    if ('id' in jsonObject) {
      this._id = jsonObject.id;
    }
    if ('name' in jsonObject) {
      this._name = jsonObject.name;
    }
    if ('firstName' in jsonObject) {
      this._firstName = jsonObject.firstName;
    }
    if ('type' in jsonObject) {
      this._type = jsonObject.type;
    }
    if ('position' in jsonObject) {
      this._position = jsonObject.position;
    }
    if ('positionID' in jsonObject) {
      this._positionID = jsonObject.positionID;
    }
    if ('color' in jsonObject) {
      this._color = jsonObject.color;
    }
    if ('avatar' in jsonObject) {
      this._avatar = jsonObject.avatar;
    }

  }
  UserDataModel.prototype.toJSON = function() {
    //stringify a phase object : used to send data to server
    return '{"id":"'+this._id+'" ,"color":"'+this._color+'" ,"avatar":"'+this._avatar+'" ,"position" : {"id":"'+this._positionID+'" ,"name" : "'+this._position+'"},"user" : {"id":"'+this._id+'" ,"name" : "'+this._name+'","firstname" : "'+this._firstName+'","type" : "'+this._type+'"}}';
  }
  UserDataModel.prototype.toHTML = function() {
  }
}());
