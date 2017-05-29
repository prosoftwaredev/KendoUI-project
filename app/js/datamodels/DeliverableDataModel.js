var DeliverableDataModel;
(function () {
	DeliverableDataModel = function DeliverableDataModel(deliverableID) {
		this._uriServices = {
			"GET": WS_BASE_URL + "deliverable", // read web service /{id}
			"POST": WS_BASE_URL + "deliverable",
			"PATCH": WS_BASE_URL + "deliverable"
		};

		this._id = deliverableID;
		if ((typeof id != "undefined") && (id != null)) {
			this._id = id;
		}

		this._title = null;
		if ((typeof name != "undefined") && (name != null)) {
			this._title = name;
		}

		this._issueDate = null;
		if ((typeof issueDate != "undefined") && (issueDate != null)) {
			this._issueDate = issueDate;
		}

		this._status = null;
		if ((typeof status != "undefined") && (status != null)) {
			this._status = status;
		}

		this._type = null;
		if ((typeof deliverableType != "undefined") && (deliverableType != null)) {
			this._type = deliverableType;
		}

		this._theme = null;
		if ((typeof deliverableTheme != "undefined") && (deliverableTheme != null)) {
			this._theme = deliverableTheme;
		}
	};

	DeliverableDataModel.prototype = Object.create(AbstractDataModel.prototype);
	// Getters
	DeliverableDataModel.prototype.GetId = function () {
		return this._id;
	}
	DeliverableDataModel.prototype.GetTitle = function () {
		return this._title;
	}
	DeliverableDataModel.prototype.GetIssueDate = function () {
		return this._issueDate;
	}
	DeliverableDataModel.prototype.GetStatus = function () {
		return this._status;
	}
	DeliverableDataModel.prototype.GetType = function () {
		return this._type;
	}
	DeliverableDataModel.prototype.GetTheme = function () {
		return this._theme;
	}
	DeliverableDataModel.prototype.GetSections = function () {
		return this._sections;
	}
	DeliverableDataModel.prototype.GetRaciRoles = function () {
		return this._raciRoleUsers;
	}
	DeliverableDataModel.prototype.GetDetailsAsObservable = function () {
		return kendo.observable({
			"title": this._title,
			"issueDate": this._issueDate,
			"status": this._status,
			"type": this._type,
			"theme": this._theme,
			"securityClassification": this._securityClassification,
			"sections": this._sections
		});
	}
	// Setters
	DeliverableDataModel.prototype.SetId = function (id) {
		this._id = id;
	}
	DeliverableDataModel.prototype.SetTitle = function (title) {
		this._title = title;
	}
	DeliverableDataModel.prototype.SetIssueDate = function (issueDate) {
		this._issueDate = issueDate;
	}
	DeliverableDataModel.prototype.SetStatus = function (status) {
		this._status = status;
	}
	DeliverableDataModel.prototype.SetTheme = function (theme) {
		this._theme = theme;
	}
	DeliverableDataModel.prototype.SetType = function (type) {
		this._type = type;
	}
	// Operations

	DeliverableDataModel.prototype.Read = function () {
		var currentUserInformation = getUserInformationBase64();
		var userId = null;

		if (currentUserInformation != null) {
			if ('userId' in currentUserInformation) {
				userId = currentUserInformation.userId;
			}
		}

		return sendHttpRequest("GET", this._uriServices.GET + "/details?deliverableId=" + this._id + "&userId=" + userId, true, this).done(function (result) {

			if (typeof result == "object") {
				this.fromJSON(result);
			}
		}).fail(function (jqXHR, textStatus) {
			console.log("Error Get DeliverableDataModel : " + textStatus);
		});
	}
	DeliverableDataModel.prototype.Create = function (deliverableObject) {
		console.log(deliverableObject);
		return sendHttpRequest("POST", this._uriServices.POST, true, this, deliverableObject).fail(function (jqXHR, textStatus) {
			console.log("Error Create DeliverableDataModel : " + textStatus);
		});
	}
	DeliverableDataModel.prototype.Update = function (deliverableObject) {

		return sendHttpRequest("PATCH", this._uriServices.PATCH + deliverableObject.GetId(), true, this, deliverableObject).fail(function (jqXHR, textStatus) {
			console.log("Error Create DeliverableDataModel : " + textStatus);
		});
	}
	DeliverableDataModel.prototype.fromJSON = function (jsonObject) {
		if ('id' in jsonObject) {
			this._id = jsonObject.id;
		}
		if ('name' in jsonObject) {
			this._title = jsonObject.name;
		}
		if ('status' in jsonObject) {
			this._status = jsonObject.status;
		}
		if ('issueDate' in jsonObject) {
			this._issueDate = jsonObject.issueDate;
		}
		if ('deliverableType' in jsonObject) {
			this._type = jsonObject.deliverableType;
		}
		if ('deliverableTheme' in jsonObject) {
			this._theme = jsonObject.deliverableTheme;
		}
		if ('securityClassification' in jsonObject) {
			this._securityClassification = jsonObject.securityClassification;
		}
		if ('sections' in jsonObject) {
			this._sections = jsonObject.sections
		}
		if ('raciRoleUsers' in jsonObject) {
			this._raciRoleUsers = jsonObject.raciRoleUsers
		}
	}
	DeliverableDataModel.prototype.toJSON = function () {
		//stringify a workprocess object : used to send data to server

		return '{"id":' + this._id + ', "title":"' + this._title + '", "status":"' + this._status + '", "theme":"' + this._theme + '", "issueDate":"' + this._issueDate + '", "theme":"' + this._theme + '" , "type":"' + this._type + '"}';
	}
	DeliverableDataModel.prototype.toHTML = function () {
	}
}());
